import { useEffect, useRef } from "react";

function SignalMonitor({ isActive }) {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;

    const draw = () => {

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "#b8ad98";
      ctx.lineWidth = 1;

      for (let y = 20; y < height; y += 30) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

      }

      ctx.strokeStyle = "#171717";
      ctx.lineWidth = 2;

      ctx.beginPath();

      for (let x = 0; x < width; x++) {

        let y = height / 2;

        if (isActive) {

          y +=
            Math.sin(x * 0.08 + Date.now() * 0.01) * 25 +
            Math.sin(x * 0.2) * 8;

        } else {

          y += Math.sin(x * 0.02) * 2;

        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

      }

      ctx.stroke();

      animationFrame = requestAnimationFrame(draw);

    };

    draw();

    return () => cancelAnimationFrame(animationFrame);

  }, [isActive]);

  return (
    <section className="signal-section">

      <div className="signal-header">

        <div>
          <span className="technical-label">
            SIGNAL MONITOR
          </span>

          <h2>Frequency Spectrum</h2>
        </div>

        <div className="frequency-readout">
          {isActive
            ? "18.0 / 19.0 KHZ"
            : "SYSTEM IDLE"}
        </div>

      </div>

      <div className="spectrum">

        <canvas
          ref={canvasRef}
          width="1200"
          height="180"
        />

        <div className="spectrum-label left">
          18 KHZ
        </div>

        <div className="spectrum-label right">
          19 KHZ
        </div>

      </div>

    </section>
  );
}

export default SignalMonitor;