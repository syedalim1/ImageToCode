"use client";
import {
  Sparkles,
  Zap,
  Code2,
  Palette,
  Clock,
  Cpu,
  Star,
  ArrowRight,
} from "lucide-react";

const HeaderSection = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
      {/* Enhanced background with more colorful elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* More vibrant background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-pink-400 opacity-20 blur-3xl"></div>
        <div className="absolute top-40 left-40 w-32 h-32 rounded-full bg-green-400 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 rounded-full bg-yellow-400 opacity-20 blur-3xl"></div>

        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white opacity-70 animate-ping"></div>
        <div
          className="absolute top-3/4 left-1/2 w-2 h-2 rounded-full bg-white opacity-70 animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-2 h-2 rounded-full bg-white opacity-70 animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black/30 rounded-full p-2">
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-pink-100">
                Image2Code Studio
              </h1>
            </div>
            <p className="text-blue-100 max-w-xl font-medium">
              Transform your visual designs into clean, production-ready code
              with AI-powered generation
            </p>

           
          </div>

          <div className="flex flex-wrap gap-4 max-w-md">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
              <Code2 className="h-5 w-5 text-blue-300" />
              <span className="text-sm">Multiple Frameworks</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
              <Palette className="h-5 w-5 text-pink-300" />
              <span className="text-sm">Modern Design</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
              <Cpu className="h-5 w-5 text-green-300" />
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span className="text-sm">Time-Saving</span>
            </div>
          </div>
        </div>

        {/* Added graphic illustration */}
        <div className="mt-8 bg-gradient-to-r from-black/30 to-purple-900/30 p-4 rounded-xl border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-lg font-medium text-white mb-2">
                How It Works
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <Star className="h-4 w-4 text-blue-300" />
                </div>
                <div className="text-sm text-blue-100">
                  Upload your design image or screenshot
                </div>
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <Zap className="h-4 w-4 text-purple-300" />
                </div>
                <div className="text-sm text-blue-100">
                  Our AI analyzes the visual elements
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-pink-500/20 p-2 rounded-full">
                  <Code2 className="h-4 w-4 text-pink-300" />
                </div>
                <div className="text-sm text-blue-100">
                  Get clean, optimized code in seconds
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 bg-gradient-to-br from-black/40 to-blue-900/20 rounded-lg border border-white/10 min-h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block p-3 bg-white/5 rounded-full mb-2">
                  <Cpu className="h-8 w-8 text-blue-300" />
                </div>
                <div className="text-sm text-blue-100">
                  Advanced neural networks powering your design workflow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
