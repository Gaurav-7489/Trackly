import { useState } from "react";

export default function RoastBot() {
  const [roast] = useState(
    "I’m watching you. Productivity detected… barely."
  );

  return (
    <div style={container}>
      <p style={roastStyle}>{roast}</p>
    </div>
  );
}

const container = {
  margin: "10px 0",
  padding: "12px",
  background: "#0b0b0b",
  borderRadius: "10px",
  textAlign: "center",
  border: "1px solid #222",
};

const roastStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ff4d4d",
};
