import React from "react";
import PerformanceChart from "../components/dashboard/performancechart";
import ConversionDonutChart from "../components/dashboard/conversionchart";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Analytics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><PerformanceChart /></div>
        <div><ConversionDonutChart /></div>
      </div>
    </div>
  );
}
