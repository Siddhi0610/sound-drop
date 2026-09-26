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

  useEffect(() => {

    return () => {
      receiverRef.current?.stop();
    };

  }, []);

  const startListening = async () => {

    setBits("");
    setFrequency(null);

    const receiver =
      new FSKReceiver({

        onBit: (bit) => {

          setBits(previous =>
            previous + bit
          );

        },

        onFrequency: (freq) => {

          setFrequency(freq);

        },

        onStatus: (newStatus) => {

          setStatus(newStatus);

        },

      });

    receiverRef.current = receiver;

    await receiver.start();
  };

  const stopListening = () => {

    receiverRef.current?.stop();

    receiverRef.current = null;

    setFrequency(null);
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
        SoundDrop listens through your microphone,
        performs frequency analysis, and reconstructs
        the transmitted binary stream.
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
            ? `${(frequency / 1000).toFixed(1)} kHz`
            : "--"}
        </strong>

      </div>

      {status === "LISTENING" ? (

        <button
          className="newspaper-button stop-button"
          onClick={stopListening}
        >
          STOP LISTENING ■
        </button>

      ) : (

        <button
          className="newspaper-button"
          onClick={startListening}
        >
          START LISTENING →
        </button>

      )}

      <div className="decoded-box">

        <span>
          RAW BINARY STREAM
        </span>

        <div className="binary-output">

          {bits || "WAITING FOR SIGNAL..."}

        </div>

      </div>

    </section>
  );
}

export default ReceiverPanel;