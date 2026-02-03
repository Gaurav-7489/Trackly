import { useMemo } from "react";
import "./RoastBot.css";

const ROASTS = [
  "Productivity detected… barely.",
  "You opened the app. That’s a start.",
  "This week is still salvageable.",
  "Momentum is optional, apparently.",
  "Small steps count. Even today.",
];

export default function RoastBot() {
  const roast = useMemo(
    () => ROASTS[Math.floor(Math.random() * ROASTS.length)],
    []
  );

  return (
    <div className="roast-bot">
      <span className="roast-label">RoastBot</span>
      <p className="roast-text">{roast}</p>
    </div>
  );
}
