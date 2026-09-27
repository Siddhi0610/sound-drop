const ZERO_FREQUENCY = 18000;
const ONE_FREQUENCY = 19000;

const SYMBOL_DURATION = 0.08; // 80 ms per bit

export class FSKTransmitter {
  constructor({ onStatus }) {
    this.onStatus = onStatus;

    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;

    this.isTransmitting = false;
  }

  textToBits(text) {
    const bytes = new TextEncoder().encode(text);

    let bits = "";

    for (const byte of bytes) {
      bits += byte
        .toString(2)
        .padStart(8, "0");
    }

    return bits;
  }

  async transmit(text) {
    if (!text || this.isTransmitting) {
      return;
    }

    this.isTransmitting = true;

    try {
      this.onStatus?.("PREPARING DATA");

      const bits = this.textToBits(text);

      console.log("Payload:", text);
      console.log("Binary:", bits);

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

      // Keep the signal reasonably quiet.
      this.gainNode.gain.setValueAtTime(
        0,
        this.audioContext.currentTime
      );

      const startTime =
        this.audioContext.currentTime + 0.1;

      this.oscillator.start(startTime);

      // Small fade-in.
      this.gainNode.gain.setValueAtTime(
        0,
        startTime
      );

      this.gainNode.gain.linearRampToValueAtTime(
        0.35,
        startTime + 0.02
      );

      for (let i = 0; i < bits.length; i++) {

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

        this.onStatus?.(
          `TRANSMITTING BIT ${i + 1}/${bits.length}`
        );
      }

      const endTime =
        startTime +
        bits.length * SYMBOL_DURATION;

      // Fade out.
      this.gainNode.gain.setValueAtTime(
        0.35,
        endTime - 0.02
      );

      this.gainNode.gain.linearRampToValueAtTime(
        0,
        endTime
      );

      this.oscillator.stop(endTime + 0.02);

      this.onStatus?.("TRANSMITTING");

      setTimeout(() => {
        this.cleanup();

        this.onStatus?.("TRANSMISSION COMPLETE");
      }, (bits.length * SYMBOL_DURATION + 0.3) * 1000);

    } catch (error) {

      console.error(
        "Transmission error:",
        error
      );

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
      this.audioContext.close();
    }

    this.oscillator = null;
    this.gainNode = null;
    this.audioContext = null;

    this.isTransmitting = false;
  }

  stop() {
    this.cleanup();

    this.onStatus?.("STANDBY");
  }
}