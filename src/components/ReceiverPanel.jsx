function ReceiverPanel({
  listen,
  isListening,
  decodedData
}) {
  return (
    <section className="paper-panel">

      <div className="panel-heading">
        <div>
          <span className="section-number">02</span>
          <span className="section-label">RECEIVER</span>
        </div>

        <span className="panel-code">RX</span>
      </div>

      <h2>Decode The Signal</h2>

      <p className="panel-description">
        The receiver listens for the transmitted frequencies,
        performs FFT analysis, and reconstructs the original data.
      </p>

      <div className="receiver-status">

        <div>
          <span className="status-dot"></span>
          MICROPHONE INPUT
        </div>

        <strong>
          {isListening ? "LISTENING" : "STANDBY"}
        </strong>

      </div>

      <button
        className="newspaper-button"
        onClick={listen}
        disabled={isListening}
      >
        {isListening
          ? "SCANNING FREQUENCIES..."
          : "START LISTENING →"}
      </button>

      <div className="decoded-box">

        <span>DECODED PAYLOAD</span>

        <div>
          {decodedData}
        </div>

      </div>

    </section>
  );
}

export default ReceiverPanel;