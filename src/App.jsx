import { useState } from "react";
import Header from "./components/Header";
import TransmissionPanel from "./components/TransmissionPanel";
import ReceiverPanel from "./components/ReceiverPanel";
import SignalMonitor from "./components/SignalMonitor";
import BinaryStream from "./components/BinaryStream";
import HowItWorks from "./components/HowItWorks";
import "./App.css";

function App() {
  const [payload, setPayload] = useState("HELLO SOUND DROP");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [decodedData, setDecodedData] = useState("WAITING FOR SIGNAL...");

  const transmit = () => {
    if (!payload.trim()) return;

    setIsTransmitting(true);
    setDecodedData("TRANSMITTING...");

    setTimeout(() => {
      setIsTransmitting(false);
      setDecodedData(payload);
    }, 1800);
  };

  const listen = () => {
    setIsListening(true);
    setDecodedData("SCANNING FREQUENCIES...");

    setTimeout(() => {
      setIsListening(false);
      setDecodedData(payload || "NO SIGNAL DETECTED");
    }, 2200);
  };

  return (
    <div className="app">
      <Header />

      <main className="main-container">

        <section className="hero">
          <div className="issue-label">
            VOL. 01 · ISSUE 01 · AUDIO COMMUNICATION
          </div>

          <h1>DATA, DELIVERED<br />THROUGH SOUND.</h1>

          <p className="hero-description">
            SoundDrop converts digital information into high-frequency
            audio signals, transmits them through the air, and reconstructs
            the original data at the receiving end.
          </p>

          <div className="hero-rule">
            <span>FSK MODULATION</span>
            <span>18–19 KHZ</span>
            <span>FFT DEMODULATION</span>
          </div>
        </section>

        <section className="workspace">

          <TransmissionPanel
            payload={payload}
            setPayload={setPayload}
            transmit={transmit}
            isTransmitting={isTransmitting}
          />

          <ReceiverPanel
            listen={listen}
            isListening={isListening}
            decodedData={decodedData}
          />

        </section>

        <SignalMonitor
          isActive={isTransmitting || isListening}
        />

        <section className="technical-grid">

          <BinaryStream payload={payload} />

          <div className="technical-card">
            <span className="technical-label">MODULATION</span>

            <div className="frequency-row">
              <span>BIT 0</span>
              <strong>18.0 kHz</strong>
            </div>

            <div className="frequency-row">
              <span>BIT 1</span>
              <strong>19.0 kHz</strong>
            </div>
          </div>

          <div className="technical-card">
            <span className="technical-label">DEMODULATION</span>

            <div className="process-text">
              AUDIO SIGNAL
              <span>↓</span>
              FFT ANALYSIS
              <span>↓</span>
              FREQUENCY
              <span>↓</span>
              BINARY DATA
            </div>
          </div>

        </section>

        <HowItWorks />

      </main>

      <footer>
        <span>SOUNDDROP SYSTEMS</span>
        <span>DATA OVER SOUND</span>
        <span>EST. 2026</span>
      </footer>
    </div>
  );
}

export default App;