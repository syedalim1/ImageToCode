import React from "react";
import { ImageIcon, Code, Calendar, Filter } from "lucide-react";
import { StatsBarProps } from "./types";

function StatsBar({
  designsCount,
  generatedCodeCount,
  thisWeekCount,
  filteredResultsCount,
}: StatsBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="p-3 rounded-full bg-blue-100 mr-3">
            <ImageIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Designs</p>
            <p className="text-xl font-bold text-gray-800">{designsCount}</p>
          </div>
        </div>

        <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="p-3 rounded-full bg-purple-100 mr-3">
            <Code className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Generated Code</p>
            <p className="text-xl font-bold text-gray-800">
              {generatedCodeCount}
            </p>
          </div>
        </div>

        <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100">
          <div className="p-3 rounded-full bg-pink-100 mr-3">
            <Calendar className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">This Week</p>
            <p className="text-xl font-bold text-gray-800">{thisWeekCount}</p>
          </div>
        </div>

        <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
          <div className="p-3 rounded-full bg-green-100 mr-3">
            <Filter className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Filtered Results</p>
            <p className="text-xl font-bold text-gray-800">
              {filteredResultsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
