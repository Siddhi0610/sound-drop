const ZERO_FREQUENCY = 18000;
const ONE_FREQUENCY = 19000;

const SYMBOL_DURATION = 80;

const PREAMBLE = "10101010";

export class FSKReceiver {

  constructor({
    onBit,
    onFrequency,
    onStatus,
    onDecoded,
    onPacket,
  }) {

    this.onBit = onBit;
    this.onFrequency = onFrequency;
    this.onStatus = onStatus;
    this.onDecoded = onDecoded;
    this.onPacket = onPacket;

    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;

    this.running = false;
    this.animationFrame = null;

    this.sampleRate = 48000;
    this.fftSize = 4096;

    this.currentBit = null;

    this.bitStartTime = null;

    this.collectedBits = "";

    this.lastDetectedFrequency = null;

    this.signalThreshold = 30;
  }

  async start() {

    if (this.running) {
      return;
    }

    try {

      this.onStatus?.(
        "REQUESTING MICROPHONE"
      );

      this.stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: {
              channelCount: 1,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });

      this.audioContext =
        new AudioContext();

      await this.audioContext.resume();

      this.sampleRate =
        this.audioContext.sampleRate;

      this.analyser =
        this.audioContext.createAnalyser();

      this.analyser.fftSize =
        this.fftSize;

      this.analyser.smoothingTimeConstant =
        0.1;

      this.microphone =
        this.audioContext
          .createMediaStreamSource(
            this.stream
          );

      this.microphone.connect(
        this.analyser
      );

      this.running = true;

      this.resetPacket();

      this.onStatus?.(
        "LISTENING"
      );

      this.detect();

    } catch (error) {

      console.error(
        "Microphone error:",
        error
      );

      this.onStatus?.(
        "MICROPHONE ACCESS FAILED"
      );
    }
  }

  stop() {

    this.running = false;

    if (this.animationFrame) {
      cancelAnimationFrame(
        this.animationFrame
      );
    }

    if (this.stream) {

      this.stream
        .getTracks()
        .forEach(track =>
          track.stop()
        );

      this.stream = null;
    }

    if (this.audioContext) {

      this.audioContext.close();

      this.audioContext = null;
    }

    this.microphone = null;
    this.analyser = null;

    this.onStatus?.(
      "STANDBY"
    );
  }

  resetPacket() {

    this.currentBit = null;
    this.bitStartTime = null;
    this.collectedBits = "";

    this.lastDetectedFrequency =
      null;
  }

  detect() {

    if (
      !this.running ||
      !this.analyser
    ) {
      return;
    }

    const frequencyData =
      new Uint8Array(
        this.analyser.frequencyBinCount
      );

    this.analyser.getByteFrequencyData(
      frequencyData
    );

    const zeroMagnitude =
      this.getFrequencyMagnitude(
        ZERO_FREQUENCY,
        frequencyData
      );

    const oneMagnitude =
      this.getFrequencyMagnitude(
        ONE_FREQUENCY,
        frequencyData
      );

    const signal =
      zeroMagnitude +
      oneMagnitude;

    if (
      signal >
      this.signalThreshold
    ) {

      const detectedBit =
        zeroMagnitude >
        oneMagnitude
          ? "0"
          : "1";

      const detectedFrequency =
        detectedBit === "0"
          ? ZERO_FREQUENCY
          : ONE_FREQUENCY;

      this.onFrequency?.(
        detectedFrequency
      );

      this.processFrequency(
        detectedBit
      );
    }

    this.animationFrame =
      requestAnimationFrame(
        () => this.detect()
      );
  }

  processFrequency(bit) {

    const now =
      performance.now();

    if (
      this.currentBit === null
    ) {

      this.currentBit = bit;

      this.bitStartTime = now;

      return;
    }

    if (
      bit === this.currentBit
    ) {

      const duration =
        now -
        this.bitStartTime;

      if (
        duration >=
        SYMBOL_DURATION
      ) {

        this.commitBit(
          this.currentBit
        );

        this.currentBit = null;

        this.bitStartTime = null;
      }

      return;
    }

    // Frequency changed.
    // Commit the previous symbol
    // before starting the next one.

    const duration =
      now -
      this.bitStartTime;

    if (
      duration >=
      SYMBOL_DURATION * 0.6
    ) {

      this.commitBit(
        this.currentBit
      );
    }

    this.currentBit = bit;

    this.bitStartTime = now;
  }

  commitBit(bit) {

    this.collectedBits += bit;

    this.onBit?.(
      bit,
      this.collectedBits
    );

    this.processPacket();
  }

  processPacket() {

    const bits =
      this.collectedBits;

    /*
      Wait for the preamble.
    */

    if (
      bits.length <
      PREAMBLE.length
    ) {
      return;
    }

    if (
      bits.slice(
        0,
        PREAMBLE.length
      ) !== PREAMBLE
    ) {

      // Search for a possible
      // new preamble.

      const index =
        bits.lastIndexOf(
          PREAMBLE
        );

      if (index >= 0) {

        this.collectedBits =
          bits.slice(index);

      } else {

        this.collectedBits =
          bits.slice(-7);
      }

      return;
    }

    /*
      Preamble found.
    */

    this.onStatus?.(
      "PREAMBLE DETECTED"
    );

    const lengthStart =
      PREAMBLE.length;

    const lengthEnd =
      lengthStart + 16;

    if (
      bits.length <
      lengthEnd
    ) {
      return;
    }

    const lengthBits =
      bits.slice(
        lengthStart,
        lengthEnd
      );

    const payloadLength =
      parseInt(
        lengthBits,
        2
      );

    this.onPacket?.({
      payloadLength,
    });

    const payloadStart =
      lengthEnd;

    const payloadEnd =
      payloadStart +
      payloadLength * 8;

    if (
      bits.length <
      payloadEnd
    ) {
      return;
    }

    const payloadBits =
      bits.slice(
        payloadStart,
        payloadEnd
      );

    const text =
      this.bitsToText(
        payloadBits
      );

    this.onDecoded?.(
      text
    );

    this.onStatus?.(
      "MESSAGE DECODED"
    );

    this.collectedBits = "";

    this.currentBit = null;
    this.bitStartTime = null;
  }

  bitsToText(bits) {

    const bytes = [];

    for (
      let i = 0;
      i < bits.length;
      i += 8
    ) {

      const byte =
        bits.slice(
          i,
          i + 8
        );

      if (
        byte.length !== 8
      ) {
        continue;
      }

      bytes.push(
        parseInt(
          byte,
          2
        )
      );
    }

    try {

      return new TextDecoder()
        .decode(
          new Uint8Array(bytes)
        );

    } catch {

      return "DECODE ERROR";
    }
  }

  getFrequencyMagnitude(
    targetFrequency,
    frequencyData
  ) {

    const frequencyBinWidth =
      this.sampleRate /
      this.fftSize;

    const index =
      Math.round(
        targetFrequency /
        frequencyBinWidth
      );

    const range = 2;

    let max = 0;

    for (
      let i = index - range;
      i <= index + range;
      i++
    ) {

      if (
        i >= 0 &&
        i < frequencyData.length
      ) {

        max = Math.max(
          max,
          frequencyData[i]
        );
      }
    }

    return max;
  }
}