import React from 'react';

// ----------------------------------------------------
// 1. RADIAL GAUGE (Circular Progress)
// ----------------------------------------------------
interface RadialGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  glowColor?: string;
  gradientColors?: [string, string]; // [StartColor, EndColor]
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label = "ATS Score",
  gradientColors = ["#a855f7", "#06b6d4"]
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none" style={{ width: size, height: size + 30 }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gauge-grad-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-zinc-800"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Filled Path */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gauge-grad-${label.replace(/\s+/g, '')})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))' }}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-2">
        <span className="text-3xl font-extrabold text-white tracking-tight leading-none">{score}</span>
        <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-1">{label}</span>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// 2. RADAR STRENGTHS CHART
// ----------------------------------------------------
interface RadarChartProps {
  data: {
    label: string;
    score: number;
  }[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  const center = size / 2;
  const radius = size * 0.35;
  const totalAxes = data.length;

  // Compute points on standard radar
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 20) * Math.cos(angle),
      labelY: center + (radius + 15) * Math.sin(angle)
    };
  };

  // Generate radar guidelines
  const gridLevels = [25, 50, 75, 100];

  // User score points
  const points = data.map((d, i) => {
    const coords = getCoordinates(i, d.score);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex items-center justify-center select-none w-full">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radar-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.4)" />
          </linearGradient>
        </defs>

        {/* Circular Grid Circles */}
        {gridLevels.map((level, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={(level / 100) * radius}
            className="radar-grid"
            fill="none"
          />
        ))}

        {/* Grid Axes Lines */}
        {data.map((_, i) => {
          const outerPoint = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerPoint.x}
              y2={outerPoint.y}
              className="radar-axis"
            />
          );
        })}

        {/* Filled polygon for scores */}
        <polygon
          points={points}
          fill="url(#radar-glow)"
          stroke="#a855f7"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />

        {/* Outer Dot Handles */}
        {data.map((d, i) => {
          const coords = getCoordinates(i, d.score);
          return (
            <circle
              key={i}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-1000 ease-out cursor-pointer hover:r-6"
            />
          );
        })}

        {/* Text Labels */}
        {data.map((d, i) => {
          const coords = getCoordinates(i, 100);
          // Adjust alignment based on coordinates
          let textAnchor: "middle" | "end" | "start" = "middle";
          if (coords.labelX < center - 10) textAnchor = "end";
          if (coords.labelX > center + 10) textAnchor = "start";

          return (
            <g key={i}>
              <text
                x={coords.labelX}
                y={coords.labelY}
                fill="#a1a1aa"
                fontSize="10"
                fontWeight="600"
                textAnchor={textAnchor}
                className="font-mono"
              >
                {d.label}
              </text>
              <text
                x={coords.labelX}
                y={coords.labelY + 11}
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
                textAnchor={textAnchor}
                className="font-mono"
              >
                {d.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


// ----------------------------------------------------
// 3. SCORE TREND LINE CHART
// ----------------------------------------------------
interface LineChartProps {
  data: {
    label: string;
    score: number;
  }[];
  width?: number;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, width = 450, height = 200 }) => {
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxScore = 100;
  const minScore = 50;
  const scoreDiff = maxScore - minScore;

  // Convert points to SVG coordinates
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.score - minScore) / scoreDiff) * chartHeight;
    return { x, y, score: d.score, label: d.label };
  });

  // Construct SVG Path (using quadratic curves for smooth flow)
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const xc = (current.x + next.x) / 2;
      const yc = (current.y + next.y) / 2;
      pathD += ` Q ${current.x} ${current.y}, ${xc} ${yc}`;
    }
    pathD += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  }

  // Construct Area Path for gradient fill
  const areaD = pathD ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z` : "";

  return (
    <div className="w-full select-none overflow-x-auto no-scrollbar">
      <svg width={width} height={height} className="overflow-visible mx-auto">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.25)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.0)" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * chartHeight;
          const labelScore = Math.round(maxScore - ratio * scoreDiff);
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                fill="#71717a"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {labelScore}
              </text>
            </g>
          );
        })}

        {/* Gradient Filled Area Under Line */}
        {areaD && (
          <path
            d={areaD}
            fill="url(#area-gradient)"
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Glowing Data Path */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))' }}
          />
        )}

        {/* Data Circle Handles & Hover Labels */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            {/* Hover tooltip placeholder */}
            <rect
              x={pt.x - 20}
              y={pt.y - 28}
              width="40"
              height="18"
              rx="4"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
            <text
              x={pt.x}
              y={pt.y - 16}
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono"
            >
              {pt.score}%
            </text>

            {/* Glowing circle points */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="7"
              fill="rgba(6, 182, 212, 0.2)"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200"
            />
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={height - 8}
            fill="#71717a"
            fontSize="10"
            fontWeight="500"
            textAnchor="middle"
            className="font-sans"
          >
            {pt.label}
          </text>
        ))}
      </svg>
    </div>
  );
};


// ----------------------------------------------------
// 4. SCORE METERS (Bar Chart Meter)
// ----------------------------------------------------
interface ScoreMeterProps {
  label: string;
  score: number;
  maxScore?: number;
  colorClass?: string;
  textColorClass?: string;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  label,
  score,
  maxScore = 100,
  colorClass = "bg-gradient-to-r from-purple-500 to-cyan-500",
  textColorClass = "text-white"
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div className="w-full mb-3 select-none">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-zinc-400 font-semibold tracking-wide">{label}</span>
        <span className={`${textColorClass} font-bold font-mono`}>{score} / {maxScore}</span>
      </div>
      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/40">
        <div
          className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
