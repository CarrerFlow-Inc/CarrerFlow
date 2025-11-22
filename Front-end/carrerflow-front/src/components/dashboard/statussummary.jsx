import React from "react";
import Card from "../ui/card";
import { getStatusTone } from "../../utils/statusColors";

export default function StatusSummary({ summary = [] }) {
  if (!summary.length) return null;
  return (
    <Card title="Por Status" className="mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {summary.map(({ label, count }) => {
          const tone = getStatusTone(label);
          return (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl border" style={{
              borderColor: tone.border,
              backgroundColor: tone.background
            }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tone.text }} aria-hidden="true"></span>
                <span className="type-body-sm" style={{ color: tone.text }}>{label}</span>
              </div>
              <span className="text-base font-semibold" style={{ color: tone.text }}>{count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
