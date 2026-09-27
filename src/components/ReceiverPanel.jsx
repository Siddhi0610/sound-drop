import { useEffect, useRef, useState } from "react";
import { FSKReceiver } from "../audio/fskReceiver";

function ReceiverPanel() {

  const receiverRef = useRef(null);

  const [status, setStatus] =
    useState("STANDBY");

  const [frequency, setFrequency] =
    useState(null);

  const [bits, setBits] =
    useState("");

  const [decoded, setDecoded] =
    useState("");

  useEffect(() => {

    return () => {
      receiverRef.current?.stop();
    };

  }, []);

  const startListening = async () => {

    setBits("");
    setDecoded("");
    setFrequency(null);

    const receiver =
      new FSKReceiver({

        onBit: (bit, stream) => {

          setBits(stream);
        },

        onFrequency: (freq) => {

          setFrequency(freq);
        },

        onStatus: (newStatus) => {

          setStatus(newStatus);
        },

        onDecoded: (message) => {

          setDecoded(message);
        },

      });

    receiverRef.current =
      receiver;

    await receiver.start();
  };

  const stopListening = () => {

    receiverRef.current?.stop();

    receiverRef.current = null;

    setFrequency(null);

    setStatus("STANDBY");
  };

  return (
    <section className="paper-panel">

      <div className="panel-heading">

        <div>

          <span className="section-number">
            02
          </span>

          <span className="section-label">
            RECEIVER
          </span>

        </div>

        <span className="panel-code">
          RX
        </span>

      </div>

      <h2>
        Decode The Signal
      </h2>

      <p className="panel-description">
        SoundDrop listens for the FSK carrier,
        identifies each symbol, reconstructs
        the binary packet and decodes the payload.
      </p>

      <div className="receiver-status">

        <div>
          <span className="status-dot"></span>
          MICROPHONE INPUT
        </div>

        <strong>
          {status}
        </strong>

      </div>

      <div className="receiver-frequency">

        <span>
          DETECTED FREQUENCY
        </span>

        <strong>
          {frequency
            ? `${(
                frequency / 1000
              ).toFixed(1)} kHz`
            : "--"}
        </strong>

      </div>

      {status === "STANDBY" ? (

        <button
          className="newspaper-button"
          onClick={
            startListening
          }
        >
          START LISTENING →
        </button>

      ) : (

        <button
          className="newspaper-button stop-button"
          onClick={
            stopListening
          }
        >
          STOP LISTENING ■
        </button>

      )}

      <div className="decoded-box">

        <span>
          RAW BINARY STREAM
        </span>

        <div className="binary-output">
          {bits ||
            "WAITING FOR SIGNAL..."}
        </div>

      </div>

      <div className="decoded-box">

        <span>
          DECODED PAYLOAD
        </span>

        <div className="decoded-message">

          {decoded ||
            "NO MESSAGE DECODED"}

        </div>

      </div>

    </section>
  );
}

export default ReceiverPanel;