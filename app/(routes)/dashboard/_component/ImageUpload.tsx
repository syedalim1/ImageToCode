"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FiUpload, FiSettings, FiEdit, FiEye, FiHelpCircle, FiShare2, FiDownload, FiSave } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { BsLayoutTextWindowReverse, BsCodeSlash } from "react-icons/bs";
import { TbBrandCss3, TbBrandHtml5, TbBrandReact } from "react-icons/tb";
import ImageDropzone from "./ImageDropzone";
import ModeSelector from "./ModeSelector";
import DescriptionInput from "./_DescriptionInput/DescriptionInput";
import ReactFeatureOptions from "./ReactFeatureOptions";
import ProgressIndicator from "./ProgressIndicator";
import LanguageSelector from "./LanguageSelector";
// import ProjectTitle from "./ProjectTitle";
import { ProjectTitleContext } from "@/app/context/ProjectTitleContext";
import { UserDescriptionContext } from "@/app/context/UserDescriptionContext";
import { IsUploadingContext } from "@/app/context/IsUploadingContext";
import { UploadedImageUrlContext } from "@/app/context/UploadedImageUrlContext";

// Define the interface outside the component
interface UploadedImageUrlContextValue {
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;
}

const ImageUpload = () => {
  // State variables
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { userDescription, setUserDescription } = useContext(UserDescriptionContext);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("normal");
  const [selectedOptions, setSelectedOptions] = useState(["responsive"]);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("react-tailwind");
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiEnhancements, setAiEnhancements] = useState<string[]>([]);
  const [recentConversions, setRecentConversions] = useState<any[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [previewScale, setPreviewScale] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState("jsx");
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Animation controls
  const controls = useAnimation();

  // Context values
  const { projectTitle, setProjectTitle } = useContext(ProjectTitleContext);
  const { isUploading, setIsUploading } = useContext(IsUploadingContext);
  const { uploadedImageUrl, setUploadedImageUrl } =
    useContext<UploadedImageUrlContextValue>(UploadedImageUrlContext);

  // Fetch recent conversions with improved error handling
  useEffect(() => {
    const fetchRecentConversions = async () => {
      if (!user) return;
      try {
        controls.start({ opacity: 0.7, scale: 0.98 });
        const email = user?.primaryEmailAddress?.emailAddress;

        if (!email) {
          throw new Error("User email not available");
        }

        const response = await axios.get(
          `/api/user-conversions?email=${email}`
        );

        if (response.data && Array.isArray(response.data.conversions)) {
          setRecentConversions(response.data.conversions.slice(0, 5));
          controls.start({ opacity: 1, scale: 1 });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch recent conversions", err);
        setError("Failed to load your recent conversions. Please try again later.");
        controls.start({ opacity: 1, scale: 1 });
      }
    };

    fetchRecentConversions();
  }, [user, controls]);

  // Enhanced progress animation with smoother transitions
  useEffect(() => {
    if (isUploading && uploadProgress < 95) {
      // More granular steps for smoother animation
      const steps = [5, 15, 25, 35, 45, 55, 65, 75, 85, 92, 95];
      let currentStep = 0;

      // Visual pulse effect when progress updates
      const pulseEffect = () => {
        controls.start({
          scale: [1, 1.02, 1],
          transition: { duration: 0.5 }
        });
      };

      const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setUploadProgress(steps[currentStep]);
          pulseEffect();
          currentStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 400);

      return () => clearInterval(progressInterval);
    }

    if (!isUploading) {
      setUploadProgress(0);
      // Reset animation
      controls.start({ scale: 1 });
    }
  }, [isUploading, controls]);

  // Enhanced file validation function
  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, WebP, or GIF)";
    }

    if (file.size > maxSize) {
      return "File size exceeds 10MB limit. Please upload a smaller image.";
    }

    return null;
  };

  // Handle upload with enhanced error handling and visual feedback
  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    // Validate file before uploading
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    // Visual feedback for upload start
    controls.start({
      scale: [1, 1.03, 1],
      transition: { duration: 0.5 }
    });

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Add metadata to the upload
    formData.append("projectTitle", projectTitle || "Untitled Project");
    formData.append("timestamp", new Date().toISOString());

    if (aiEnhancements.length > 0) {
      formData.append("aiEnhancements", JSON.stringify(aiEnhancements));
    }

    if (selectedTheme) {
      formData.append("theme", selectedTheme);
    }

    try {
      setUploadProgress(10);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      setUploadProgress(100);

      // Success animation
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.7, ease: "easeInOut" }
      });

      const result = await response.json();
      console.log("✅ Uploaded Image URL:", result.url);
      setUploadedImageUrl(result.url);

    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");

      // Error animation
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };

  // Track conversion analytics
  const trackConversion = (uid: string, status: 'started' | 'completed' | 'failed', details?: any) => {
    try {
      // This would typically send data to your analytics service
      console.log(`📊 Analytics - Conversion ${status}:`, {
        uid,
        timestamp: new Date().toISOString(),
        user: user?.primaryEmailAddress?.emailAddress,
        details
      });

      // You could implement actual analytics tracking here
      // Example: mixpanel.track('conversion_event', { status, uid, ... })
    } catch (err) {
      console.error("Analytics tracking error:", err);
    }
  };

  // Convert image to code with enhanced error handling and user feedback
  useEffect(() => {
    if (!uploadedImageUrl) return;

    // Visual feedback before conversion starts
    controls.start({
      opacity: [1, 0.8, 1],
      scale: [1, 0.98, 1],
      transition: { duration: 0.7 }
    });

    setTimeout(() => {
      imagetoCodeConvert(uploadedImageUrl);
    }, 500);
  }, [uploadedImageUrl, controls]);

  const imagetoCodeConvert = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) {
      console.error("❌ Image URL is missing!");
      setError("Image URL is missing. Please try uploading again.");
      return;
    }

    setLoading(true);
    let conversionUid = "";

    try {
      // Generate a unique ID for this conversion
      conversionUid = uuidv4();
      const currentDate = new Date().toISOString();
      const userEmail = user?.primaryEmailAddress?.emailAddress || "";

      // Enhanced request payload with additional metadata
      const payload = {
        uid: conversionUid,
        description: userDescription,
        imageUrl: imageUrl,
        mode: selectedMode,
        email: userEmail,
        options: selectedOptions,
        createdAt: currentDate,
        language: selectedLanguage,
        theme: selectedTheme,
        projectTitle: projectTitle || "Untitled Project",
        aiEnhancements: aiEnhancements,
      };

      console.log("📤 Sending Request:", payload);

      // Track conversion started
      trackConversion(conversionUid, 'started', {
        mode: selectedMode,
        language: selectedLanguage,
        options: selectedOptions
      });

      // Send the request with a timeout
      const result = await Promise.race([
        axios.post("/api/codetoimage", payload),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
        )
      ]) as any;

      console.log("✅ Success:", result.data);

      // Track conversion completed
      trackConversion(conversionUid, 'completed', {
        responseTime: result.data.processingTime || 'unknown',
        codeSize: result.data.codeSize || 'unknown'
      });

      // Success animations and feedback
      setShowConfetti(true);
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.7, ease: "easeInOut" }
      });

      setTimeout(() => {
        setShowConfetti(false);
        router.push(`/generate-code/${conversionUid}`);
      }, 2500);
    } catch (error) {
      // Track conversion failed
      if (conversionUid) {
        trackConversion(conversionUid, 'failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      }

      // Error animation
      controls.start({
        x: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      });

      if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });

        // More user-friendly error messages based on status code
        const status = error.response?.status;
        if (status === 413) {
          setError("The image is too large. Please try with a smaller image.");
        } else if (status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else if (status && status >= 500) {
          setError("Server error. Our team has been notified and is working on it.");
        } else {
          setError(`Error: ${error.response?.data?.error || error.message}`);
        }
      } else if (error instanceof Error && error.message.includes("timed out")) {
        setError("Request timed out. The server might be busy, please try again later.");
      } else {
        console.error("❌ Unknown Error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const toggleOption = (option: string): void => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Check if we can proceed to next step
  const canProceed = () => {
    if (activeTab === "upload") return !!selectedFile;
    if (activeTab === "options") return selectedMode !== "";
    if (activeTab === "description") return true; // Allow proceeding from description tab
    if (activeTab === "preview") return true;
    return false;
  };

  // Go to next step
  const goToNextStep = () => {
    if (activeTab === "upload") setActiveTab("options");
    else if (activeTab === "options") setActiveTab("description");
    else if (activeTab === "description") setActiveTab("preview");
    else if (activeTab === "preview") handleUpload();
  };

  // Scroll to appropriate section when tab changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  // Function to render enhanced action button with dynamic styling and animations
  const renderActionButton = () => {
    // Dynamic button styling based on selected theme
    const getButtonStyle = () => {
      switch (selectedTheme) {
        case "purple":
          return "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700";
        case "green":
          return "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700";
        default: // blue theme
          return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700";
      }
    };

    // Dynamic button content based on active tab
    const getButtonContent = () => {
      if (activeTab === "upload") {
        return (
          <>
            <FiSettings className="mr-2" />
            Continue to Options
          </>
        );
      } else if (activeTab === "options") {
        return (
          <>
            <FiEdit className="mr-2" />
            Add Description
          </>
        );
      } else if (activeTab === "description") {
        return (
          <>
            <FiEye className="mr-2" />
            Preview
          </>
        );
      } else {
        return (
          <>
            <BsCodeSlash className="mr-2" />
            Generate Code
          </>
        );
      }
    };

    return (
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        whileTap={{ scale: 0.95 }}
        className={`mt-6 px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto 
          ${getButtonStyle()} text-white flex items-center justify-center shadow-lg
          ${!canProceed() ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={canProceed() ? goToNextStep : undefined}
        disabled={!canProceed()}
      >
        {getButtonContent()}

        {/* Animated arrow for button */}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="ml-2"
        >
          →
        </motion.div>
      </motion.button>
    );
  };

  // Function to render enhanced step indicators with animations and icons
  const renderStepIndicators = () => {
    const steps = [
      { id: "upload", label: "Upload", icon: <FiUpload className="w-4 h-4" /> },
      { id: "options", label: "Options", icon: <FiSettings className="w-4 h-4" /> },
      { id: "description", label: "Describe", icon: <FiEdit className="w-4 h-4" /> },
      { id: "preview", label: "Preview", icon: <FiEye className="w-4 h-4" /> }
    ];
    const currentStepIndex = steps.findIndex(step => step.id === activeTab);

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-1 sm:space-x-3 bg-white p-3 rounded-xl shadow-md border border-gray-100">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <motion.div
                whileHover={{ scale: index <= currentStepIndex ? 1.1 : 1 }}
                whileTap={{ scale: index <= currentStepIndex ? 0.95 : 1 }}
                className={`relative group flex flex-col items-center`}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{
                    scale: index === currentStepIndex ? 1.1 : 1,
                    backgroundColor: index <= currentStepIndex
                      ? selectedTheme === "blue" ? "#3b82f6"
                        : selectedTheme === "purple" ? "#8b5cf6"
                          : selectedTheme === "green" ? "#10b981"
                            : "#3b82f6"
                      : "#e5e7eb"
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md
                  ${index <= currentStepIndex
                      ? "text-white"
                      : "text-gray-400"}`}
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      controls.start({
                        scale: [1, 0.95, 1],
                        transition: { duration: 0.3 }
                      });
                      setActiveTab(steps[index].id);
                    }
                  }}
                >
                  {step.icon}

                  {/* Pulse animation for current step */}
                  {index === currentStepIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0.3, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.4 }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        repeatType: "loop"
                      }}
                      style={{
                        backgroundColor: selectedTheme === "blue" ? "#3b82f6"
                          : selectedTheme === "purple" ? "#8b5cf6"
                            : selectedTheme === "green" ? "#10b981"
                              : "#3b82f6"
                      }}
                    />
                  )}
                </motion.div>

                {/* Step label */}
                <span className={`text-xs mt-1 hidden sm:block ${index <= currentStepIndex ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </motion.div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 max-w-[40px] relative h-1 bg-gray-200">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: index < currentStepIndex ? "100%" : index === currentStepIndex ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 h-full"
                    style={{
                      backgroundColor: selectedTheme === "blue" ? "#3b82f6"
                        : selectedTheme === "purple" ? "#8b5cf6"
                          : selectedTheme === "green" ? "#10b981"
                            : "#3b82f6"
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full  mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8  `}
      ref={containerRef}
    >
      {/* Step indicators */}
      {renderStepIndicators()}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6"
        >
          {/* Image Upload Area */}
          {activeTab === "upload" && (
            <motion.div
              className={`p-3 sm:p-4 md:p-6 lg:p-8 border-2 border-dashed rounded-xl  bg-gradient-to-br from-purple-50 to-blue-50 border-blue-200 relative`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >


              <ImageDropzone
                setSelectedFile={setSelectedFile}
                error={error}
                setError={setError}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}

          {/* Options Area */}
          {activeTab === "options" && (
            <div className="">
              <div className="space-y-4">
                {/* Language Selector */}
                <motion.div
                  className={`p-4 rounded-lg shadow-sm w-full h-full  bg-white border border-gray-100`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                  />
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Mode Selector */}
                <motion.div
                  className={`p-4 rounded-lg shadow-sm  bg-white border border-gray-100 `}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <ModeSelector
                    selectedMode={selectedMode}
                    setSelectedMode={setSelectedMode}
                  />
                </motion.div>

                {/* React Features */}
                <motion.div
                  className={`p-4 rounded-lg shadow-sm bg-white border border-gray-100`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <ReactFeatureOptions
                    selectedOptions={selectedOptions}
                    toggleOption={toggleOption}
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* Description Input */}
          {activeTab === "description" && (
            <motion.div
              className={`p-4 sm:p-6 rounded-lg shadow-sm w-full bg-white border border-gray-100`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-lg font-semibold mb-3 text-gray-800`}>
                Describe Your Requirements
              </h3>
              <DescriptionInput />

              {/* AI-powered suggestion chips */}
              <div className="mt-4">
                <p className={`text-sm mb-2  text-gray-600`}>
                  Suggested descriptions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Make it responsive",
                    "Add animations",
                    "Modern UI",
                    "Accessible design",
                    "E-commerce layout",
                  ].map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200`}
                      onClick={() =>
                        setUserDescription((prev: string) =>
                          prev ? `${prev} ${suggestion}.` : suggestion
                        )
                      }
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Mode with enhanced features */}
          {activeTab === "preview" && (
            <motion.div
              className={`p-6 rounded-xl shadow-md w-full bg-white border border-gray-100`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h3 className={`text-xl font-semibold mb-2 sm:mb-0 text-gray-800 flex items-center`}>
                  <FiEye className="mr-2 text-blue-500" />
                  Preview Your Design
                </h3>

                <div className="flex space-x-3">
                  {/* Theme selector button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowColorPalette(!showColorPalette)}
                    className="flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    <IoColorPaletteOutline className="mr-2" />
                    Theme
                  </motion.button>

                  {/* Export options button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    <FiDownload className="mr-2" />
                    Export
                  </motion.button>

                  {/* Share button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    <FiShare2 className="mr-2" />
                    Share
                  </motion.button>
                </div>
              </div>

              {/* Color palette selector */}
              <AnimatePresence>
                {showColorPalette && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-3 text-gray-700 flex items-center">
                        <IoColorPaletteOutline className="mr-2" />
                        Select Color Theme
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { id: "blue", label: "Blue", colors: ["#3b82f6", "#1d4ed8"] },
                          { id: "purple", label: "Purple", colors: ["#8b5cf6", "#6d28d9"] },
                          { id: "green", label: "Green", colors: ["#10b981", "#047857"] },
                          { id: "red", label: "Red", colors: ["#ef4444", "#b91c1c"] },
                          { id: "amber", label: "Amber", colors: ["#f59e0b", "#b45309"] },
                          { id: "pink", label: "Pink", colors: ["#ec4899", "#be185d"] },
                        ].map((theme) => (
                          <motion.div
                            key={theme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                            onClick={() => setSelectedTheme(theme.id)}
                          >
                            <div className="w-12 h-12 rounded-full mb-1 flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}>
                              {selectedTheme === theme.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-white"
                                >
                                  ✓
                                </motion.div>
                              )}
                            </div>
                            <span className="text-xs text-gray-600">{theme.label}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Export options */}
              <AnimatePresence>
                {showExportOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-3 text-gray-700 flex items-center">
                        <FiDownload className="mr-2" />
                        Export Options
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: "jsx", label: "JSX", icon: <TbBrandReact /> },
                          { id: "tsx", label: "TSX", icon: <TbBrandReact /> },
                          { id: "html", label: "HTML", icon: <TbBrandHtml5 /> },
                          { id: "css", label: "CSS", icon: <TbBrandCss3 /> },
                          { id: "code", label: "Full Code", icon: <BsCodeSlash /> },
                          { id: "zip", label: "ZIP Package", icon: <FiSave /> },
                        ].map((format) => (
                          <motion.div
                            key={format.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center p-3 rounded-lg cursor-pointer border ${exportFormat === format.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                            onClick={() => setExportFormat(format.id)}
                          >
                            <div className={`mr-2 text-lg ${exportFormat === format.id ? 'text-blue-500' : 'text-gray-400'}`}>
                              {format.icon}
                            </div>
                            <span className={`text-sm ${exportFormat === format.id ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                              {format.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share options */}
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-3 text-gray-700 flex items-center">
                        <FiShare2 className="mr-2" />
                        Share Your Design
                      </h4>
                      <div className="flex flex-col space-y-3">
                        <div className="flex">
                          <input
                            type="text"
                            readOnly
                            value="https://imagetocode.com/share/your-unique-link"
                            className="flex-1 p-2 border border-gray-300 rounded-l-lg text-sm"
                          />
                          <button className="bg-blue-500 text-white px-3 rounded-r-lg text-sm hover:bg-blue-600">
                            Copy
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button className="flex-1 py-2 bg-[#1877F2] text-white rounded-lg text-sm flex items-center justify-center">
                            <span className="mr-2">Facebook</span>
                          </button>
                          <button className="flex-1 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm flex items-center justify-center">
                            <span className="mr-2">Twitter</span>
                          </button>
                          <button className="flex-1 py-2 bg-[#0A66C2] text-white rounded-lg text-sm flex items-center justify-center">
                            <span className="mr-2">LinkedIn</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image preview with zoom controls */}
              {selectedFile && (
                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Image Preview</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPreviewScale(Math.max(0.5, previewScale - 0.1))}
                        className="p-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setPreviewScale(Math.min(2, previewScale + 0.1))}
                        className="p-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setPreviewScale(1)}
                        className="p-1 bg-white border border-gray-200 rounded-md hover:bg-gray-100 text-xs"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center overflow-hidden rounded-lg bg-white border border-gray-200 p-2">
                    <motion.div
                      animate={{ scale: previewScale }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="relative"
                    >
                      <img
                        src={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                        alt="Preview"
                        className="max-w-full h-auto max-h-[300px] object-contain"
                      />
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Summary of selections with enhanced styling */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium mb-3 text-gray-700 flex items-center">
                  <BsLayoutTextWindowReverse className="mr-2" />
                  Summary of Selections
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Technical Specifications</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="w-24 text-gray-500">Language:</span>
                        <span className="font-medium text-gray-800">{selectedLanguage}</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-24 text-gray-500">Mode:</span>
                        <span className="font-medium text-gray-800">{selectedMode}</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-24 text-gray-500">Theme:</span>
                        <span className="font-medium text-gray-800 capitalize">{selectedTheme}</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-24 text-gray-500">Export Format:</span>
                        <span className="font-medium text-gray-800 uppercase">{exportFormat}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Features & Enhancements</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedOptions.map(option => (
                        <span key={option} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {option}
                        </span>
                      ))}
                      {aiEnhancements.map(enhancement => (
                        <span key={enhancement} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {enhancement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro tips */}
              <motion.div
                className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <HiOutlineSparkles className="mr-2" />
                    Pro Tips
                  </h4>
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {showTips ? 'Hide' : 'Show'}
                  </button>
                </div>

                <AnimatePresence>
                  {showTips && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 text-sm text-blue-700 mt-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Add detailed descriptions for more accurate code generation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Choose the right language based on your project requirements</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Use high-quality images for better results</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      {(isUploading || loading) && (
        <motion.div
          className={`mt-6 bg-white border border-gray-100 p-4 rounded-lg shadow-sm`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressIndicator
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        className="mt-6 sm:mt-8 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderActionButton()}
      </motion.div>

      {/* Loading overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <div className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full"></div>
                <div className="absolute inset-4 border-4 border-teal-500 border-l-transparent rounded-full"></div>
              </div>

              <h3 className={`text-xl font-semibold mb-2 text-gray-800`}>
                Generating Your Code
              </h3>

              <p className={`text-gray-600 mb-4`}>
                This may take a moment as we analyze your image and create
                beautiful React components...
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                <motion.div
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 background-animate"
                  initial={{ width: "10%" }}
                  animate={{
                    width: ["10%", "30%", "50%", "70%", "90%"],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>

              <div className="flex space-x-2 items-center mt-2">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                  className="w-3 h-3 rounded-full bg-blue-500"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                  className="w-3 h-3 rounded-full bg-purple-500"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.4,
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                  className="w-3 h-3 rounded-full bg-teal-500"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Floating help button */}
      <motion.button
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-blue-500 text-white hover:bg-blue-600 z-10`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default ImageUpload;
