import { useEffect, useRef } from "react";

interface ScoreGaugeProps {
  score: number; // 0 to 1
  size?: number;
}

function getScoreLabel(score: number): {
  label: string;
  color: string;
  glow: string;
} {
  const pct = score * 100;
  if (pct <= 30) {
    return {
      label: "Low",
      color: "oklch(0.55 0.18 145)",
      glow: "oklch(0.8 0.15 145 / 0.25)",
    };
  }
  if (pct <= 60) {
    return {
      label: "Moderate",
      color: "oklch(0.65 0.18 72)",
      glow: "oklch(0.8 0.15 80 / 0.25)",
    };
  }
  return {
    label: "High",
    color: "oklch(0.55 0.22 25)",
    glow: "oklch(0.8 0.2 25 / 0.25)",
  };
}

export function ScoreGauge({ score, size = 180 }: ScoreGaugeProps) {
  const arcRef = useRef<SVGCircleElement>(null);
  const { label, color, glow } = getScoreLabel(score);
  const pct = Math.round(score * 100);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.78;
  const circumference = 2 * Math.PI * radius;
  // We only use 3/4 of the circle (270 degrees)
  const arcLength = circumference * 0.75;
  const offset = arcLength - arcLength * score;

  useEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;
    arc.style.strokeDasharray = `${arcLength} ${circumference}`;
    arc.style.strokeDashoffset = `${arcLength}`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (arc) {
          arc.style.transition =
            "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
          arc.style.strokeDashoffset = `${offset}`;
        }
      });
    });
  }, [arcLength, circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(135deg)" }}
          role="img"
          aria-label={`Plagiarism score: ${pct}%`}
        >
          <title>Plagiarism score: {pct}%</title>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="oklch(0.9 0.01 240)"
            strokeWidth={size * 0.07}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <circle
            ref={arcRef}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.07}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${glow})`,
            }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-display font-bold"
            style={{
              fontSize: size * 0.25,
              color,
              lineHeight: 1,
            }}
          >
            {pct}%
          </span>
          <span
            className="font-display font-medium"
            style={{
              fontSize: size * 0.11,
              color: "oklch(0.52 0.03 240)",
              marginTop: 2,
            }}
          >
            SIMILARITY
          </span>
        </div>
      </div>
      <div
        className="font-display font-semibold text-sm px-3 py-1 rounded-full"
        style={{
          color,
          backgroundColor: `${glow}`,
          border: `1.5px solid ${color}`,
        }}
      >
        {label} Plagiarism Risk
      </div>
    </div>
  );
}
