function BinaryStream({ payload }) {

  const binary = Array.from(payload || "")
    .map(char =>
      char.charCodeAt(0)
        .toString(2)
        .padStart(8, "0")
    )
    .join(" ");

  return (
    <div className="technical-card">

      <span className="technical-label">
        BINARY STREAM
      </span>

      <div className="binary-stream">
        {binary || "00000000"}
      </div>

    </div>
  );
}

export default BinaryStream;