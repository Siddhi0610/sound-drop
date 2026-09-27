const ZERO_FREQUENCY = 18000;
const ONE_FREQUENCY = 19000;

const SYMBOL_DURATION = 0.08;

const PREAMBLE = "10101010";

export class FSKTransmitter {
  constructor({ onStatus, onBit }) {
    this.onStatus = onStatus;
    this.onBit = onBit;

    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;

    this.isTransmitting = false;
  }

  textToBytes(text) {
    return new TextEncoder().encode(text);
  }

  bytesToBits(bytes) {
    let bits = "";

    for (const byte of bytes) {
      bits += byte
        .toString(2)
        .padStart(8, "0");
    }

    return bits;
  }

  createPacket(text) {
    const payloadBytes = this.textToBytes(text);

    const payloadBits =
      this.bytesToBits(payloadBytes);

    const lengthBits =
      payloadBytes.length
        .toString(2)
        .padStart(16, "0");

    return (
      PREAMBLE +
      lengthBits +
      payloadBits
    );
  }

  async transmit(text) {

    if (!text || this.isTransmitting) {
      return;
    }

    this.isTransmitting = true;

    try {

      const bits =
        this.createPacket(text);

      console.log(
        "Transmission packet:",
        bits
      );

      this.onStatus?.(
        `PACKET READY · ${bits.length} BITS`
      );

      this.audioContext =
        new AudioContext();

      await this.audioContext.resume();

      this.oscillator =
        this.audioContext.createOscillator();

      this.gainNode =
        this.audioContext.createGain();

      this.oscillator.type = "sine";

      this.oscillator.connect(
        this.gainNode
      );

      this.gainNode.connect(
        this.audioContext.destination
      );

      this.gainNode.gain.setValueAtTime(
        0,
        this.audioContext.currentTime
      );

      const startTime =
        this.audioContext.currentTime + 0.2;

      this.oscillator.start(startTime);

      this.gainNode.gain.linearRampToValueAtTime(
        0.35,
        startTime + 0.02
      );

      for (
        let i = 0;
        i < bits.length;
        i++
      ) {

        const bit = bits[i];

        const frequency =
          bit === "0"
            ? ZERO_FREQUENCY
            : ONE_FREQUENCY;

        const symbolStart =
          startTime +
          i * SYMBOL_DURATION;

        this.oscillator.frequency
          .setValueAtTime(
            frequency,
            symbolStart
          );

        this.onBit?.(bit, i);

      }

      const endTime =
        startTime +
        bits.length *
        SYMBOL_DURATION;

      this.gainNode.gain.setValueAtTime(
        0.35,
        endTime - 0.03
      );

      this.gainNode.gain.linearRampToValueAtTime(
        0,
        endTime
      );

      this.oscillator.stop(
        endTime + 0.05
      );

      this.onStatus?.(
        "TRANSMITTING"
      );

      setTimeout(() => {

        this.cleanup();

        this.onStatus?.(
          "TRANSMISSION COMPLETE"
        );

      }, (bits.length *
        SYMBOL_DURATION +
        0.4) * 1000);

    } catch (error) {

      console.error(error);

      this.cleanup();

      this.onStatus?.(
        "TRANSMISSION FAILED"
      );
    }
  }

  cleanup() {

    if (this.oscillator) {
      try {
        this.oscillator.disconnect();
      } catch {}
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
    }

    this.oscillator = null;
    this.gainNode = null;
    this.audioContext = null;

    this.isTransmitting = false;
  }

  stop() {
    this.cleanup();

    this.onStatus?.(
      "STANDBY"
    );
  }
}