"use client";
import { Sparkles } from "lucide-react";

const HeaderSection = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div>
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Image2Code Studio
            </h1>
          </div>
          <p className="text-blue-100 max-w-xl">
            Transform your visual designs into clean, production-ready React
            code with AI-powered generation
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
