"use client";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import ImageDropzone from "./ImageDropzone";
import ModeSelector from "./ModeSelector";
import DescriptionInput from "./DescriptionInput";
import ReactFeatureOptions from "./ReactFeatureOptions";
import ProgressIndicator from "./ProgressIndicator";
import LanguageSelector from "./LanguageSelector";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("normal");
  const [selectedOptions, setSelectedOptions] = useState(["responsive"]);
  const [activeTab, setActiveTab] = useState("upload");
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("react-tailwind");
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [screenSize, setScreenSize] = useState("lg");
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiEnhancements, setAiEnhancements] = useState<string[]>([]);
  const [recentConversions, setRecentConversions] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState("desktop");

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("xs");
      else if (width < 768) setScreenSize("sm");
      else if (width < 1024) setScreenSize("md");
      else if (width < 1280) setScreenSize("lg");
      else setScreenSize("xl");
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch recent conversions
  useEffect(() => {
    const fetchRecentConversions = async () => {
      if (!user) return;
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        const response = await axios.get(
          `/api/user-conversions?email=${email}`
        );
        setRecentConversions(response.data.conversions.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch recent conversions", err);
      }
    };

    fetchRecentConversions();
  }, [user]);

  // Progress animation
  useEffect(() => {
    if (isUploading && uploadProgress < 95) {
      const steps = [10, 30, 50, 70, 85, 95];
      let currentStep = 0;

      const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setUploadProgress(steps[currentStep]);
          currentStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 300);

      return () => clearInterval(progressInterval);
    }

    if (!isUploading) {
      setUploadProgress(0);
    }
  }, [isUploading]);

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    if (aiEnhancements.length > 0) {
      formData.append("aiEnhancements", JSON.stringify(aiEnhancements));
    }

    try {
      setUploadProgress(10);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setUploadProgress(100);

      const result = await response.json();
      console.log("Uploaded Image URL:", result.url);
      setUploadedImageUrl(result.url);

      setShowSuccessIndicator(true);
      setTimeout(() => {
        setShowSuccessIndicator(false);
      }, 2000);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };

  // Convert image to code
  useEffect(() => {
    if (!uploadedImageUrl) return;
    setTimeout(() => {
      imagetoCodeConvert(uploadedImageUrl);
    }, 500);
  }, [uploadedImageUrl]);

  const imagetoCodeConvert = async (imageUrl: string): Promise<void> => {
    if (!imageUrl) {
      console.error("❌ Image URL is missing!");
      return;
    }

    setLoading(true);

    try {
      const uid = uuidv4();
      const currentDate = new Date().toISOString();
      const userEmail = user?.primaryEmailAddress?.emailAddress || "";

      console.log("📤 Sending Request:", {
        uid,
        description: userDescription,
        imageUrl: imageUrl,
        mode: selectedMode,
        email: userEmail,
        options: selectedOptions,
        theme: selectedTheme,
        createdAt: currentDate,
        model: "deepseek",
        language: selectedLanguage,
      });

      const result = await axios.post("/api/codetoimage", {
        uid: uid,
        description: userDescription,
        imageUrl: imageUrl,
        mode: selectedMode,
        email: userEmail,
        options: selectedOptions,
        theme: selectedTheme,
        createdAt: currentDate,
        model: "deepseek",
        language: selectedLanguage,
      });

      console.log("✅ Success:", result.data);

      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        router.push(`/view-code/${uid}`);
      }, 2500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        setError(`Error: ${error.response?.data?.error || error.message}`);
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
    if (activeTab === "description") return userDescription.length > 0;
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

  // Function to render the action button
  const renderActionButton = () => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`mt-6 px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto ${
          canProceed()
            ? selectedTheme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
            : selectedTheme === "dark"
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        onClick={canProceed() ? goToNextStep : undefined}
        disabled={!canProceed()}
      >
        {activeTab === "upload" && "Continue to Options"}
        {activeTab === "options" && "Add Description"}
        {activeTab === "description" && "Preview"}
        {activeTab === "preview" && "Generate Code"}
      </motion.button>
    );
  };

  // Function to render the step indicators
  const renderStepIndicators = () => {
    const steps = ["upload", "options", "description", "preview"];
    const currentStepIndex = steps.indexOf(activeTab);

    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                  index <= currentStepIndex
                    ? selectedTheme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : selectedTheme === "dark"
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-300 text-gray-600"
                }`}
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setActiveTab(steps[index]);
                  }
                }}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-10 h-1 ${
                    index < currentStepIndex
                      ? selectedTheme === "dark"
                        ? "bg-blue-600"
                        : "bg-blue-500"
                      : selectedTheme === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-300"
                  }`}
                />
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
      className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${
        selectedTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-white to-blue-50"
      }`}
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
              className={`p-3 sm:p-4 md:p-6 lg:p-8 border-2 border-dashed rounded-xl ${
                selectedTheme === "dark"
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600"
                  : "bg-gradient-to-br from-purple-50 to-blue-50 border-blue-200"
              } relative`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <ImageDropzone
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                preview={preview}
                setPreview={setPreview}
                error={error}
                setError={setError}
                setShowSuccessIndicator={setShowSuccessIndicator}
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
                  className={`p-4 rounded-lg shadow-sm w-full h-full ${
                    selectedTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                  />
                </motion.div>

                {/* Theme Selector - New Component */}
                <motion.div
                  className={`p-4 rounded-lg shadow-sm ${
                    selectedTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 ${
                      selectedTheme === "dark"
                        ? "text-gray-200"
                        : "text-gray-800"
                    }`}
                  >
                    Theme
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedTheme === "light"
                          ? "bg-blue-500 text-white"
                          : selectedTheme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSelectedTheme("light")}
                    >
                      Light
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedTheme === "dark"
                          ? "bg-blue-500 text-white"
                          : selectedTheme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setSelectedTheme("dark")}
                    >
                      Dark
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Mode Selector */}
                <motion.div
                  className={`p-4 rounded-lg shadow-sm ${
                    selectedTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
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
                  className={`p-4 rounded-lg shadow-sm ${
                    selectedTheme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
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
              className={`p-4 sm:p-6 rounded-lg shadow-sm w-full ${
                selectedTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border border-gray-100"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3
                className={`text-lg font-semibold mb-3 ${
                  selectedTheme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Describe Your Requirements
              </h3>
              <DescriptionInput
                userDescription={userDescription}
                setUserDescription={setUserDescription}
                isUploading={isUploading}
              />

              {/* AI-powered suggestion chips */}
              <div className="mt-4">
                <p
                  className={`text-sm mb-2 ${
                    selectedTheme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
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
                      className={`text-xs px-3 py-1 rounded-full ${
                        selectedTheme === "dark"
                          ? "bg-blue-900 text-blue-100 hover:bg-blue-800"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                      onClick={() =>
                        setUserDescription((prev) =>
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

          {/* Preview Mode */}
          {activeTab === "preview" && (
            <motion.div
              className={`p-4 sm:p-6 rounded-lg shadow-sm w-full ${
                selectedTheme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border border-gray-100"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h3
                  className={`text-lg font-semibold mb-2 sm:mb-0 ${
                    selectedTheme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Preview Your Design
                </h3>

                {/* Device selector */}
                <div className="flex space-x-2">
                  {["mobile", "tablet", "desktop"].map((device) => (
                    <button
                      key={device}
                      className={`px-3 py-1 rounded text-sm ${
                        previewMode === device
                          ? selectedTheme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : selectedTheme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setPreviewMode(device)}
                    >
                      {device.charAt(0).toUpperCase() + device.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display preview image */}
              {preview && (
                <div
                  className={`mt-4 flex justify-center ${
                    previewMode === "mobile"
                      ? "max-w-xs"
                      : previewMode === "tablet"
                      ? "max-w-md"
                      : "max-w-2xl"
                  } mx-auto border rounded-lg overflow-hidden`}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}

              <div className="mt-6">
                <h4
                  className={`font-medium mb-2 ${
                    selectedTheme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Summary of Selections
                </h4>
                <ul
                  className={`list-disc pl-5 ${
                    selectedTheme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>Language: {selectedLanguage}</li>
                  <li>Mode: {selectedMode}</li>
                  <li>Features: {selectedOptions.join(", ")}</li>
                  {aiEnhancements.length > 0 && (
                    <li>AI Enhancements: {aiEnhancements.join(", ")}</li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      {(isUploading || loading) && (
        <motion.div
          className={`mt-6 ${
            selectedTheme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-gray-100"
          } p-4 rounded-lg shadow-sm`}
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
            className={`${
              selectedTheme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-lg max-w-md w-full mx-4`}
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

              <h3
                className={`text-xl font-semibold mb-2 ${
                  selectedTheme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Generating Your Code
              </h3>

              <p
                className={`${
                  selectedTheme === "dark" ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
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
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${
          selectedTheme === "dark"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        } z-10`}
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
