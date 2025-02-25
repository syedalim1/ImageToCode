"use client";
import { Button } from "@/components/ui/button";
import {
  CloudUpload,
  Loader2,
  X,
  Code2,
  Sparkles,
  BrainCircuit,
  Palette,
  Layout,
  Move,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// New Options for React
const REACT_OPTIONS = [
  {
    name: "Animations",
    value: "animations",
    icon: <Move className="h-5 w-5" />,
    description: "Add smooth animations to components",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: <Layout className="h-5 w-5" />,
    description: "Ensure the design works on all screen sizes",
  },
];

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDescription, setUserDescription] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAiModel, setSelectedAiModel] = useState("Gemini Google AI");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Image Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
      }

      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  // Image Upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log("Uploaded Image URL:", result.url);
      setUploadedImageUrl(result.url);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert Image to Code (runs when uploadedImageUrl updates)
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

      console.log("📤 Sending Request:", {
        uid,
        description: userDescription,
        imageUrl: imageUrl,
        model: selectedAiModel,
        email: user?.primaryEmailAddress?.emailAddress || "",
        options: selectedOptions, // Include selected options
      });

      // Save the data to the database *before* redirecting
      const result = await axios.post("/api/codetoimage", {
        uid: uid,
        description: userDescription,
        imageUrl: imageUrl,
        code: "", // Initial code is empty
        model: selectedAiModel,
        email: user?.primaryEmailAddress?.emailAddress || "",
        options: selectedOptions,
      });

      console.log("✅ Success:", result.data);

      router.push(`/view-code/${uid}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
      } else {
        console.error("❌ Unknown Error:", error);
      }
    }
  };

  // Toggle React Options
  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mt-10 max-w-6xl mx-auto"
    >
      {/* Brand Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Image2Code
          </h1>
        </div>
        <p className="text-gray-600 text-center">
          Transform visual designs into clean, production-ready React code
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          variants={itemVariants}
          className="p-8 border-2 border-dashed rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 relative"
        >
          <div
            {...getRootProps()}
            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer 
              ${isDragActive ? "bg-blue-50 border-blue-500" : ""}
              ${error ? "border-red-500 bg-red-50" : ""}`}
          >
            <input {...getInputProps()} id="imageselect" />

            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 object-contain rounded-md mb-4"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                <CloudUpload className="h-10 w-10 mb-4" />
                <h2 className="font-bold text-lg mb-2">
                  {isDragActive ? "Drop image here" : "Upload Image"}
                </h2>
                <p className="text-gray-400 text-sm">
                  Click to select or drag and drop
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  (PNG, JPG, JPEG up to 5MB)
                </p>
              </>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {selectedFile && (
            <div className="mt-4 w-full">
              {/* <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Process Image"
                )}
              </Button> */}
            </div>
          )}
        </motion.div>

        {/* Settings Section */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* AI Model Selection */}
          {/* <div className="p-6 bg-white rounded-xl shadow-lg border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Model Selection
            </h2>
            <Select onValueChange={setSelectedAiModel} value={selectedAiModel}>
              <SelectTrigger className="w-full bg-gray-50">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {Constants.AiModel.map((model, index) => (
                  <SelectItem
                    key={index}
                    value={model.modelname}
                    className="flex gap-3 items-center py-3 bg-gray-200"
                  >
                    <div className={`p-2 rounded-lg flex  '}`}>
                      <BrainCircuit className="h-5 w-5" />
                      <p className="font-medium text-blue-600">{model.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* React Options */}
          <div className="p-6 bg-white rounded-xl shadow-lg border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              React Features
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {REACT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
                    selectedOptions.includes(option.value)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-blue-600">{option.icon}</span>
                  <div className="text-left">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 bg-white rounded-xl shadow-lg border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CloudUpload className="h-5 w-5 text-green-600" />
              Image Context
            </h2>
            <textarea
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              disabled={isUploading}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {500 - userDescription.length} characters remaining
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUserDescription("")}
              >
                Clear
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Process Button */}
      <motion.div variants={itemVariants} className="mt-8 flex justify-center">
        <Button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 shadow-lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Magic...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate React Code
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default ImageUpload;
