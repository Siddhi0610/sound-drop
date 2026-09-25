function TransmissionPanel({
  payload,
  setPayload,
  transmit,
  isTransmitting
}) {
  return (
    <section className="paper-panel">

      <div className="panel-heading">
        <div>
          <span className="section-number">01</span>
          <span className="section-label">TRANSMITTER</span>
        </div>

        <span className="panel-code">TX</span>
      </div>

      <h2>Encode Your Data</h2>

      <p className="panel-description">
        Enter a message. SoundDrop converts each character into
        binary data and maps each bit to a different audio frequency.
      </p>

      <label>PAYLOAD</label>

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder="ENTER DATA..."
      />

      <div className="signal-specs">

        <div>
          <span>ENCODING</span>
          <strong>8-BIT BINARY</strong>
        </div>

        <div>
          <span>MODULATION</span>
          <strong>FSK</strong>
        </div>

      </div>

      <button
        className="newspaper-button"
        onClick={transmit}
        disabled={isTransmitting}
      >
        {isTransmitting
          ? "TRANSMITTING..."
          : "TRANSMIT VIA SOUND →"}
      </button>

    </section>
  );
}

export default TransmissionPanel;