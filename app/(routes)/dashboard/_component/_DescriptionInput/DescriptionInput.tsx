// DescriptionInput.tsx (fully updated version)
"use client";

import { IsUploadingContext } from "@/app/context/IsUploadingContext";
import { UserDescriptionContext } from "@/app/context/UserDescriptionContext";
import { ProjectTitleContext } from "@/app/context/ProjectTitleContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { BackgroundElements } from "./BackgroundElements";
import { SuccessCheckmark } from "./SuccessCheckmark";
import { TemplatesPanel } from "./TemplatesPanel";
import { AiSuggestionsPanel } from "./AiSuggestionsPanel";
import { TagSuggestionsPanel } from "./TagSuggestionsPanel";
import { DescriptionTextarea } from "./DescriptionTextarea";
import { HeaderSection } from "./HeaderSection";
import { ActionButtons } from "./ActionButtons";
import { aiSuggestions, tagSuggestions } from "./aiSuggestionsData";
import { formatExportContent, downloadAsFile } from "./utils";
import { Template, AiSuggestion } from "./types";

const DescriptionInput = () => {
  const { userDescription, setUserDescription } = useContext(UserDescriptionContext);
  const { isUploading, setIsUploading } = useContext(IsUploadingContext);
  const { projectTitle } = useContext(ProjectTitleContext);

  // Enhanced state management
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(true);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);
  const [characterLimit] = useState(1500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'suggestions' | 'templates'>('suggestions');
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

  // Save template function with enhanced features
  const saveTemplate = () => {
    if (userDescription.trim()) {
      // Check if template with same content already exists
      const exists = savedTemplates.some(template => template.content === userDescription);

      if (!exists) {
        // Generate a title from the content or use project title if available
        const title = projectTitle || userDescription.substring(0, 30) + (userDescription.length > 30 ? '...' : '');

        const newTemplate: Template = {
          id: `template-${Date.now()}`,
          content: userDescription,
          title,
          createdAt: Date.now(),
          category: selectedCategory || 'General'
        };

        const newTemplates = [newTemplate, ...savedTemplates];
        setSavedTemplates(newTemplates);
        localStorage.setItem('descriptionTemplates', JSON.stringify(newTemplates));

        // Show success animation
        setShowSavedSuccess(true);

        // Animate the textarea
        controls.start({
          scale: [1, 1.02, 1],
          borderColor: ['rgba(99, 102, 241, 0.4)', 'rgba(16, 185, 129, 0.7)', 'rgba(99, 102, 241, 0.4)'],
          transition: { duration: 0.5 }
        });
      }
    }
  };

  // Delete template function
  const deleteTemplate = (id: string) => {
    const newTemplates = savedTemplates.filter(template => template.id !== id);
    setSavedTemplates(newTemplates);
    localStorage.setItem('descriptionTemplates', JSON.stringify(newTemplates));
  };

  // Copy to clipboard function with enhanced feedback
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userDescription);
    setCopiedToClipboard(true);

    // Animate the textarea
    controls.start({
      scale: [1, 1.02, 1],
      borderColor: ['rgba(99, 102, 241, 0.4)', 'rgba(16, 185, 129, 0.7)', 'rgba(99, 102, 241, 0.4)'],
      transition: { duration: 0.5 }
    });

    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  // Get AI suggestion with category filtering
  const getAiSuggestion = (categoryFilter?: string | React.MouseEvent) => {
    setIsGeneratingSuggestion(true);

    // Handle case when called from onClick event
    const category = typeof categoryFilter === 'string' ? categoryFilter : undefined;
    
    // Filter suggestions by category if provided
    const filteredSuggestions = category
      ? aiSuggestions.filter(s => s.category === category)
      : aiSuggestions;

    // Simulate AI suggestion generation
    setTimeout(() => {
      const randomSuggestion = filteredSuggestions[
        Math.floor(Math.random() * filteredSuggestions.length)
      ];
      setUserDescription(randomSuggestion.content);
      setIsGeneratingSuggestion(false);
      setShowAiSuggestions(false);
    }, 1500);
  };

  // Export description as a file
  const exportDescription = (format: 'txt' | 'md' | 'json') => {
    const formattedData = formatExportContent(userDescription, projectTitle || '', format);
    downloadAsFile(formattedData.content, formattedData.mimeType, formattedData.filename);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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

        {/* Action buttons */}
        <ActionButtons
          saveTemplate={saveTemplate}
          copyToClipboard={copyToClipboard}
          exportDescription={exportDescription}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          copiedToClipboard={copiedToClipboard}
        />

        {/* Saved templates panel */}
        <TemplatesPanel
          showTemplates={showTemplates}
          savedTemplates={savedTemplates}
          setUserDescription={setUserDescription}
          deleteTemplate={deleteTemplate}
        />

        {/* AI Suggestions panel */}
        <AiSuggestionsPanel
          showAiSuggestions={showAiSuggestions}
          getAiSuggestion={getAiSuggestion}
          isGeneratingSuggestion={isGeneratingSuggestion}
        />

        {/* Enhanced tag suggestions with categories */}
        {!isUploading && (
          <TagSuggestionsPanel
            tagSuggestions={tagSuggestions}
            setUserDescription={setUserDescription}
            userDescription={userDescription}
          />
        )}
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