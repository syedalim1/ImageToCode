"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Image as ImageIcon, Wand2 } from "lucide-react";

interface DescriptionInputProps {
  userDescription: string;
  setUserDescription: (description: string) => void;
  isUploading: boolean;
  preview: string | null;
}

export default function DescriptionInput({
  userDescription,
  setUserDescription,
  isUploading,
  preview,
}: DescriptionInputProps) {
  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-100/40 to-pink-100/40 opacity-50" />
      
      <div className="relative p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-700 text-sm font-medium inline-flex items-center gap-1.5">
            <Wand2 className="h-4 w-4" />
            Final Step
          </span>
          <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Describe Your Design
          </h2>
          <p className="text-gray-600 mt-2">
            Help us understand your design better for optimal code generation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Describe your design and any specific requirements..."
                className="w-full h-48 p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none
                  placeholder:text-gray-400"
                disabled={isUploading}
              />
              <Sparkles className="absolute right-3 top-3 h-5 w-5 text-purple-400 opacity-50" />
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Minimum 10 characters required
            </p>
          </motion.div>

          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Preview Image</h3>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 