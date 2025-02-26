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
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["responsive"]);
  const [activeTab, setActiveTab] = useState<"upload" | "options" | "description">("upload");
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="mt-6 max-w-6xl mx-auto">
      {/* Header */}
      <HeaderSection />

      {/* Progress Steps */}
      <ProgressSteps 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedFile={selectedFile}
        selectedOptions={selectedOptions}
      />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel - Changes based on active tab */}
        <div className="p-8 border-2 border-dashed rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 relative">
          {activeTab === "upload" && (
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
          )}

          {activeTab === "options" && (
            <ModeSelector
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              preview={preview}
            />
          )}

          {activeTab === "description" && (
            <DescriptionInput
              userDescription={userDescription}
              setUserDescription={setUserDescription}
              isUploading={isUploading}
              preview={preview}
            />
          )}
        </div>

        {/* Right Panel - Features and Options */}
        <div className="space-y-6">
          {/* React Features */}
          <ReactFeatureOptions
            selectedOptions={selectedOptions}
            toggleOption={toggleOption}
          />

          <ProgressIndicator
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>

      {/* Action Button */}
      <ActionButton
        activeTab={activeTab}
        isUploading={isUploading}
        canProceed={canProceed()}
        handleUpload={handleUpload}
        goToNextStep={goToNextStep}
      />
    </div>
  );
};

export default ImageUpload;
