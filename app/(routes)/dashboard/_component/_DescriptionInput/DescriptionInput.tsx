// DescriptionInput.tsx (fully updated version)
"use client";

import { IsUploadingContext } from "@/app/context/IsUploadingContext";
import { UserDescriptionContext } from "@/app/context/UserDescriptionContext";
import { ProjectTitleContext } from "@/app/context/ProjectTitleContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { BackgroundElements } from "./BackgroundElements";
import { SuccessCheckmark } from "./SuccessCheckmark";
import { TagSuggestionsPanel } from "./TagSuggestionsPanel";
import { DescriptionTextarea } from "./DescriptionTextarea";
import { HeaderSection } from "./HeaderSection";
import { Template, } from "./types";

const DescriptionInput = () => {
  const { userDescription, setUserDescription } = useContext(UserDescriptionContext);
  const { isUploading, setIsUploading } = useContext(IsUploadingContext);
  const { projectTitle } = useContext(ProjectTitleContext);

  // Enhanced state management
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const [showSavedSuccess, setShowSavedSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controls = useAnimation();

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Load saved templates from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('descriptionTemplates');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);

        // Handle both old format (string[]) and new format (Template[])
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === 'string') {
            // Convert old format to new format
            const converted = parsed.map((content, index) => ({
              id: `template-${index}`,
              content,
              title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
              createdAt: Date.now() - (index * 1000 * 60 * 60) // Fake timestamps
            }));
            setSavedTemplates(converted);
          } else {
            setSavedTemplates(parsed);
          }
        }
      } catch (e) {
        console.error('Error parsing saved templates:', e);
        setSavedTemplates([]);
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6 shadow-xl border border-purple-200 relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 opacity-20 blur-xl"></div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 opacity-20 blur-xl"></div>
      <BackgroundElements />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <HeaderSection
          setShowTemplates={setShowTemplates}
          showTemplates={showTemplates}
          setShowAiSuggestions={setShowAiSuggestions}
          showAiSuggestions={showAiSuggestions}
        />

        <motion.div animate={controls}>
          <DescriptionTextarea
            userDescription={userDescription}
            setUserDescription={setUserDescription}
            isUploading={isUploading}
            textareaRef={textareaRef}
          />
        </motion.div>

      </motion.div>

      {/* Show success animation */}
      <AnimatePresence>
        {showSavedSuccess && (
          <SuccessCheckmark onComplete={() => setShowSavedSuccess(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DescriptionInput;