const ZERO_FREQUENCY = 18000;
const ONE_FREQUENCY = 19000;

export class FSKReceiver {
  constructor({
    onBit,
    onFrequency,
    onStatus,
  }) {
    this.onBit = onBit;
    this.onFrequency = onFrequency;
    this.onStatus = onStatus;

    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.stream = null;

    this.animationFrame = null;
    this.running = false;

    this.sampleRate = 48000;
    this.fftSize = 4096;

    this.lastBit = null;
    this.stableCount = 0;

    // Number of consecutive detections required
    // before accepting a new bit.
    this.requiredStableFrames = 3;
  }

  async start() {
    if (this.running) return;

    try {
      this.onStatus?.("REQUESTING MICROPHONE");

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.audioContext = new AudioContext();

      this.sampleRate = this.audioContext.sampleRate;

      this.analyser = this.audioContext.createAnalyser();

      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = 0.15;

      this.microphone =
        this.audioContext.createMediaStreamSource(
          this.stream
        );

      this.microphone.connect(this.analyser);

      this.running = true;

      this.onStatus?.("LISTENING");

      this.detect();

    } catch (error) {
      console.error("Microphone error:", error);

      this.onStatus?.(
        "MICROPHONE ACCESS FAILED"
      );
    }
  }

  stop() {
    this.running = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.stream) {
      this.stream
        .getTracks()
        .forEach(track => track.stop());

      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.microphone = null;
    this.analyser = null;

    this.onStatus?.("STANDBY");
  }

  detect() {
    if (!this.running || !this.analyser) {
      return;
    }

    const bufferLength =
      this.analyser.frequencyBinCount;

    const frequencyData =
      new Uint8Array(bufferLength);

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

    const totalSignal =
      zeroMagnitude + oneMagnitude;

    if (totalSignal > 30) {

      let detectedBit;

      if (zeroMagnitude > oneMagnitude) {
        detectedBit = "0";
        this.onFrequency?.(
          ZERO_FREQUENCY,
          zeroMagnitude
        );
      } else {
        detectedBit = "1";
        this.onFrequency?.(
          ONE_FREQUENCY,
          oneMagnitude
        );
      }

      this.processBit(detectedBit);
    }

    this.animationFrame =
      requestAnimationFrame(
        () => this.detect()
      );
  }

  processBit(bit) {

    if (bit === this.lastBit) {
      this.stableCount++;
    } else {
      this.lastBit = bit;
      this.stableCount = 1;
    }

    if (
      this.stableCount >=
      this.requiredStableFrames
    ) {
      this.onBit?.(bit);

      this.stableCount = 0;
    }
  }

  getFrequencyMagnitude(
    targetFrequency,
    frequencyData
  ) {
    const frequencyBinWidth =
      this.sampleRate / this.fftSize;

    const index = Math.round(
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