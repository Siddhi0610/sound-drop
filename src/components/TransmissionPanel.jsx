import { useEffect, useRef, useState } from "react";
import { FSKTransmitter } from "../audio/fskTransmitter";

function TransmissionPanel({
  payload,
}) {

  const transmitterRef = useRef(null);

  const [status, setStatus] =
    useState("STANDBY");

  const transmit = async () => {

    if (!payload.trim()) {
      setStatus("ENTER DATA FIRST");
      return;
    }

    const transmitter =
      new FSKTransmitter({
        onStatus: setStatus,
      });

    transmitterRef.current =
      transmitter;

    await transmitter.transmit(
      payload
    );
  };

  useEffect(() => {

    return () => {
      transmitterRef.current?.stop();
    };

  }, []);

  return (
    <section className="paper-panel">

      <div className="panel-heading">

        <div>
          <span className="section-number">
            01
          </span>

          <span className="section-label">
            TRANSMITTER
          </span>
        </div>

        <span className="panel-code">
          TX
        </span>

      </div>

      <h2>
        Encode Your Data
      </h2>

      <p className="panel-description">
        Enter a message. SoundDrop converts
        the data into binary and transmits
        each bit as an audio frequency.
      </p>

      <label>
        PAYLOAD
      </label>

      <textarea
        value={payload}
        onChange={() => {}}
        readOnly
      />

      <div className="signal-specs">

        <div>
          <span>BIT 0</span>
          <strong>18.0 KHZ</strong>
        </div>

        <div>
          <span>BIT 1</span>
          <strong>19.0 KHZ</strong>
        </div>

      </div>

      <div className="receiver-frequency">

        <span>
          TRANSMITTER STATUS
        </span>

        <strong>
          {status}
        </strong>

      </div>

      <button
        className="newspaper-button"
        onClick={transmit}
        disabled={
          status.startsWith("TRANSMITTING")
        }
      >
        {status.startsWith("TRANSMITTING")
          ? "TRANSMITTING..."
          : "TRANSMIT VIA SOUND →"}
      </button>

    </section>
  );
}

export default TransmissionPanel;