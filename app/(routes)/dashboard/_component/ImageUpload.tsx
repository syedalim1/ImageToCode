"use client";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Import components
import ImageDropzone from "./ImageDropzone";
import HeaderSection from "./HeaderSection";
import ProgressSteps from "./ProgressSteps";
import ModeSelector from "./ModeSelector";
import DescriptionInput from "./DescriptionInput";
import ReactFeatureOptions from "./ReactFeatureOptions";
import ProgressIndicator from "./ProgressIndicator";
import ActionButton from "./ActionButton";
import LanguageSelector from "./LanguageSelector";

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("normal"); // Default to normal mode
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "responsive",
  ]);
  const [activeTab, setActiveTab] = useState<
    "upload" | "options" | "description"
  >("upload");
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("react-tailwind");
  const [screenSize, setScreenSize] = useState<
    "xs" | "sm" | "md" | "lg" | "xl"
  >("lg");

  // Handle screen size detection for better responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("xs");
      else if (width < 768) setScreenSize("sm");
      else if (width < 1024) setScreenSize("md");
      else if (width < 1280) setScreenSize("lg");
      else setScreenSize("xl");
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulated progress for better UX
  useEffect(() => {
    if (isUploading && uploadProgress < 95) {
      const timer = setTimeout(() => {
        setUploadProgress(95);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (!isUploading) {
      setUploadProgress(0);
    }
  }, [isUploading, uploadProgress]);

  // Enhanced Image Upload with progress tracking
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Simulate initial progress
      setUploadProgress(10);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Simulate completion
      setUploadProgress(100);

      const result = await response.json();
      console.log("Uploaded Image URL:", result.url);
      setUploadedImageUrl(result.url);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
    }
  };

  // Convert Image to Code with enhanced feedback
  useEffect(() => {
    if (!uploadedImageUrl) return;
    setTimeout(() => {
      imagetoCodeConvert(uploadedImageUrl);
    }, 500);
  }, [uploadedImageUrl]);

  const imagetoCodeConvert = async (imageUrl: string) => {
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
        createdAt: currentDate,
        model: "deepseek",
      });

      // Save the data to the database *before* redirecting
      const result = await axios.post("/api/codetoimage", {
        uid: uid,
        description: userDescription,
        imageUrl: imageUrl,
        mode: selectedMode,
        email: userEmail,
        options: selectedOptions,
        createdAt: currentDate,
        model: "deepseek",
      });

      console.log("✅ Success:", result.data);

      // Add a small delay for better UX
      setTimeout(() => {
        router.push(`/view-code/${uid}`);
      }, 800);
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

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Function to determine if we should proceed to next step
  const canProceed = () => {
    if (activeTab === "upload") return !!selectedFile;
    if (activeTab === "options") return selectedMode !== "";
    if (activeTab === "description") return userDescription.length > 0;
    return false;
  };

  // Function to go to next step
  const goToNextStep = () => {
    if (activeTab === "upload") setActiveTab("options");
    else if (activeTab === "options") setActiveTab("description");
    else if (activeTab === "description") handleUpload();
  };

  // Function to scroll to appropriate section when tab changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      ref={containerRef}
    >
      {/* Header with responsive spacing */}
      <HeaderSection />

      {/* Progress Steps with horizontal scrolling for small screens */}
      <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="min-w-[600px] sm:min-w-0 px-4 sm:px-0">
          <ProgressSteps
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedFile={selectedFile}
            selectedOptions={selectedOptions}
          />
        </div>
      </div>

      {/* Main Content Area with improved responsive layout */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
        {/* Image Upload Area - Responsive border and padding */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 border-2 border-dashed rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 relative">
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
        </div>

        {/* Options Area - Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Language Selector */}
            <div className="bg-white p-4 rounded-lg  shadow-sm border border-gray-100">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Mode Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <ModeSelector
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                preview={preview}
              />
            </div>
            {/* React Features */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <ReactFeatureOptions
                selectedOptions={selectedOptions}
                toggleOption={toggleOption}
              />
            </div>
          </div>
        </div>
        {/* Description Input - Always visible and full width */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Describe Your Requirements
          </h3>
          <DescriptionInput
            userDescription={userDescription}
            setUserDescription={setUserDescription}
            isUploading={isUploading}
            preview={preview}
          />
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <ProgressIndicator
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </div>
      {/* Action Button - Fixed width on mobile, auto on larger screens */}
      <div className="mt-6 sm:mt-8 flex justify-center">
        <div className="w-full sm:w-auto">
          <ActionButton
            activeTab={activeTab}
            isUploading={isUploading || loading}
            canProceed={canProceed()}
            handleUpload={handleUpload}
            goToNextStep={goToNextStep}
          />
        </div>
      </div>

      {/* Loading overlay - covers entire screen when processing */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">
                Generating Your Code
              </h3>
              <p className="text-gray-600">
                This may take a moment as we analyze your image and create
                beautiful React components...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
