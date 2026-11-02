import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, SlidersHorizontal } from 'lucide-react';

type ChartMetric = 'expense' | 'income' | 'cashflow';

export const MonthlyTrendChart: React.FC = () => {
  const [metric, setMetric] = useState<ChartMetric>('cashflow');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; date: string } | null>(null);

  // Data points corresponding to screenshot timeline
  const pointsData: Record<ChartMetric, { date: string; value: number }[]> = {
    cashflow: [
      { date: 'Jan 2025', value: 0 },
      { date: 'Mar 2025', value: 120 },
      { date: 'May 2025', value: 450 },
      { date: 'Jul 2025', value: 980 },
      { date: 'Sep 2025', value: 1850 },
      { date: 'Nov 2025', value: 2600 },
      { date: 'Jan 2026', value: 3300 },
      { date: 'Apr 2026', value: 3950 },
    ],
    expense: [
      { date: 'Jan 2025', value: 650 },
      { date: 'Mar 2025', value: 720 },
      { date: 'May 2025', value: 850 },
      { date: 'Jul 2025', value: 1100 },
      { date: 'Sep 2025', value: 1400 },
      { date: 'Nov 2025', value: 1900 },
      { date: 'Jan 2026', value: 2400 },
      { date: 'Apr 2026', value: 3100 },
    ],
    income: [
      { date: 'Jan 2025', value: 1200 },
      { date: 'Mar 2025', value: 1800 },
      { date: 'May 2025', value: 2400 },
      { date: 'Jul 2025', value: 3200 },
      { date: 'Sep 2025', value: 4100 },
      { date: 'Nov 2025', value: 4800 },
      { date: 'Jan 2026', value: 5900 },
      { date: 'Apr 2026', value: 7050 },
    ],
  };

  const currentPoints = pointsData[metric];
  const maxValue = metric === 'income' ? 8000 : 4000;

  // SVG Chart Geometry
  const width = 360;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;
  const chartW = width - paddingX * 1.5;
  const chartH = height - paddingY * 2;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (currentPoints.length - 1)) * chartW;
    const y = height - paddingY - (Math.min(val, maxValue) / maxValue) * chartH;
    return { x, y };
  };

  // Build SVG path
  const pathD = currentPoints.reduce((acc, pt, i) => {
    const { x, y } = getCoordinates(i, pt.value);
    if (i === 0) return `M ${x} ${y}`;
    const prev = getCoordinates(i - 1, currentPoints[i - 1].value);
    const cpX1 = prev.x + (x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (x - prev.x) / 2;
    const cpY2 = y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
  }, '');

  // Fill area under path
  const lastPoint = getCoordinates(currentPoints.length - 1, currentPoints[currentPoints.length - 1].value);
  const firstPoint = getCoordinates(0, currentPoints[0].value);
  const areaD = `${pathD} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`;

  const lineColor = metric === 'expense' ? '#E11D48' : metric === 'income' ? '#059669' : '#3B82F6';
  const fillColor = metric === 'expense' ? 'rgba(225, 29, 72, 0.08)' : metric === 'income' ? 'rgba(5, 150, 105, 0.08)' : 'rgba(59, 130, 246, 0.08)';

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs select-none">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-neutral-800">
          Monthly Charts
        </h3>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setMetric('expense')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            metric === 'expense'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <ArrowDownLeft className="w-3 h-3 text-neutral-400" />
          <span>Expense</span>
        </button>
        <button
          onClick={() => setMetric('income')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            metric === 'income'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <ArrowUpRight className="w-3 h-3 text-neutral-400" />
          <span>Income</span>
        </button>
        <button
          onClick={() => setMetric('cashflow')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            metric === 'cashflow'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <TrendingUp className="w-3 h-3 text-neutral-400" />
          <span>Cashflow</span>
        </button>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - 10}
            y2={height - paddingY}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height - paddingY - chartH * 0.25}
            x2={width - 10}
            y2={height - paddingY - chartH * 0.25}
            stroke="#F3F4F6"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height - paddingY - chartH * 0.5}
            x2={width - 10}
            y2={height - paddingY - chartH * 0.5}
            stroke="#F3F4F6"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height - paddingY - chartH * 0.75}
            x2={width - 10}
            y2={height - paddingY - chartH * 0.75}
            stroke="#F3F4F6"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - 10}
            y2={paddingY}
            stroke="#F3F4F6"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Y Axis Labels */}
          <text x={paddingX - 6} y={height - paddingY + 3} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            $0
          </text>
          <text x={paddingX - 6} y={height - paddingY - chartH * 0.25 + 3} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            ${metric === 'income' ? '2k' : '1k'}
          </text>
          <text x={paddingX - 6} y={height - paddingY - chartH * 0.5 + 3} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            ${metric === 'income' ? '4k' : '2k'}
          </text>
          <text x={paddingX - 6} y={height - paddingY - chartH * 0.75 + 3} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            ${metric === 'income' ? '6k' : '3k'}
          </text>
          <text x={paddingX - 6} y={paddingY + 3} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            ${metric === 'income' ? '8k' : '4k'}
          </text>

          {/* Area gradient */}
          <path d={areaD} fill={fillColor} />

          {/* Smooth line */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive points */}
          {currentPoints.map((pt, i) => {
            const { x, y } = getCoordinates(i, pt.value);
            return (
              <g
                key={i}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint({ x, y, val: pt.value, date: pt.date })}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke={lineColor}
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-150"
                />
              </g>
            );
          })}

          {/* X Axis Labels */}
          <text x={paddingX} y={height - 6} textAnchor="start" className="text-[9px] fill-neutral-400 font-mono-nums">
            Jan 2025
          </text>
          <text x={paddingX + chartW * 0.33} y={height - 6} textAnchor="middle" className="text-[9px] fill-neutral-400 font-mono-nums">
            May 2025
          </text>
          <text x={paddingX + chartW * 0.66} y={height - 6} textAnchor="middle" className="text-[9px] fill-neutral-400 font-mono-nums">
            Sep 2025
          </text>
          <text x={paddingX + chartW} y={height - 6} textAnchor="end" className="text-[9px] fill-neutral-400 font-mono-nums">
            Apr 2026
          </text>
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 px-2 py-1 bg-neutral-900 text-white text-[10px] rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-8 font-mono-nums"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <div>{hoveredPoint.date}</div>
            <div className="font-bold">${hoveredPoint.val.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
