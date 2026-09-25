function HowItWorks() {

  return (
    <section className="how-section">

      <div className="how-header">

        <span className="technical-label">
          THE PROCESS
        </span>

        <h2>How SoundDrop Works</h2>

      </div>

      <div className="process-grid">

        <div className="process-step">

          <span>01</span>

          <h3>DATA</h3>

          <p>
            A text message or digital payload enters
            the transmitter.
          </p>

        </div>

        <div className="process-arrow">→</div>

        <div className="process-step">

          <span>02</span>

          <h3>FSK</h3>

          <p>
            Data is converted into binary and each bit
            is assigned a frequency.
          </p>

        </div>

        <div className="process-arrow">→</div>

        <div className="process-step">

          <span>03</span>

          <h3>AUDIO</h3>

          <p>
            The frequency-coded signal becomes a
            high-frequency sound wave.
          </p>

        </div>

        <div className="process-arrow">→</div>

        <div className="process-step">

          <span>04</span>

          <h3>FFT</h3>

          <p>
            The receiver analyses the incoming audio
            and identifies its frequency.
          </p>

        </div>

        <div className="process-arrow">→</div>

        <div className="process-step">

          <span>05</span>

          <h3>DATA</h3>

          <p>
            Detected frequencies are converted back
            into the original binary payload.
          </p>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;