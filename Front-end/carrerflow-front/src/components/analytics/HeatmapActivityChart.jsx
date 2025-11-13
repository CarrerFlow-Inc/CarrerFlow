import React from 'react';

export default function HeatmapActivityChart({ data = [] }) {
  // data: [{ weekIndex, days: [{ date:'YYYY-MM-DD', count }] }]
  const max = Math.max(0, ...data.flatMap(w => w.days.map(d => d.count)));
  function intensity(count) {
    if (count === 0) return 'bg-gray-100';
    const ratio = count / (max || 1);
    if (ratio > 0.66) return 'bg-gray-900 text-white';
    if (ratio > 0.33) return 'bg-gray-600 text-white';
    return 'bg-gray-300 text-gray-700';
  }
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
          {data.map(week => (
            <div key={week.weekIndex} className="flex flex-col gap-1">
              {week.days.map(day => (
                <div
                  key={day.date}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-medium ${intensity(day.count)} transition-colors`}
                  title={`${day.date} • ${day.count} candidaturas`}
                >
                  {day.count > 0 ? day.count : ''}
                </div>
              ))}
              <div className="text-[10px] text-center mt-1 text-gray-500">S{week.weekIndex+1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
