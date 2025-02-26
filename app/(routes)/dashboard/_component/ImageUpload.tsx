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
  Zap,
  Layers,
  Smartphone,
  Globe,
  Lightbulb,
  Cpu,
  Wand2,
  FileCode,
  Bookmark,
  Share2,
  Download,
  CheckCircle,
  Image as ImageIcon,
  RefreshCw,
  Maximize,
  Minimize,
  ArrowRight,
} from "lucide-react";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    } 
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
};

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Enhanced Options for React
const REACT_OPTIONS = [
  {
    name: "Animations",
    value: "animations",
    icon: <Move className="h-5 w-5" />,
    description: "Add smooth animations to components",
    color: "bg-purple-100 text-purple-600",
    hoverColor: "hover:bg-purple-50",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
    color: "bg-pink-100 text-pink-600",
    hoverColor: "hover:bg-pink-50",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: <Layout className="h-5 w-5" />,
    description: "Ensure the design works on all screen sizes",
    color: "bg-blue-100 text-blue-600",
    hoverColor: "hover:bg-blue-50",
  },
  {
    name: "Performance Optimized",
    value: "performance",
    icon: <Zap className="h-5 w-5" />,
    description: "Code optimized for fast loading and rendering",
    color: "bg-yellow-100 text-yellow-600",
    hoverColor: "hover:bg-yellow-50",
  },
  {
    name: "Component Architecture",
    value: "components",
    icon: <Layers className="h-5 w-5" />,
    description: "Well-structured reusable component system",
    color: "bg-green-100 text-green-600",
    hoverColor: "hover:bg-green-50",
  },
  {
    name: "Mobile First",
    value: "mobile",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Prioritize mobile experience with adaptive design",
    color: "bg-indigo-100 text-indigo-600",
    hoverColor: "hover:bg-indigo-50",
  },
];

// AI Model options with visual enhancements
const AI_MODELS = [
  {
    id: "gemini",
    name: "Gemini Pro",
    description: "Google's advanced multimodal AI model",
    icon: <Cpu className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-600",
    logo: "/google.png"
  },
  {
    id: "gpt4",
    name: "GPT-4 Vision",
    description: "OpenAI's powerful visual understanding model",
    icon: <Wand2 className="h-5 w-5" />,
    color: "bg-green-100 text-green-600",
    logo: "/meta.png"
  },
  {
    id: "claude",
    name: "Claude 3",
    description: "Anthropic's state-of-the-art AI assistant",
    icon: <Lightbulb className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-600",
    logo: "/deepseek.png"
  }
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
  const [selectedAiModel, setSelectedAiModel] = useState("Gemini Pro");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["responsive"]);
  const [activeTab, setActiveTab] = useState<"upload" | "options" | "description">("upload");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tips for better results
  const tips = [
    "Use high-resolution images for better code generation",
    "Add detailed descriptions to improve accuracy",
    "Select relevant React features for your specific needs",
    "Try different AI models for varied results",
    "Simple UI designs convert more accurately than complex ones"
  ];

  // Simulated progress for better UX
  useEffect(() => {
    if (isUploading && uploadProgress < 95) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 15, 95));
      }, 300);
      return () => clearTimeout(timer);
    }
    if (!isUploading) {
      setUploadProgress(0);
    }
  }, [isUploading, uploadProgress]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Image Dropzone with enhanced feedback
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
      reader.onload = () => {
        setPreview(reader.result as string);
        // Show success indicator briefly
        setShowSuccessIndicator(true);
        setTimeout(() => setShowSuccessIndicator(false), 2000);
        // Automatically move to options tab after successful upload
        setTimeout(() => setActiveTab("options"), 1000);
      };
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
    setActiveTab("upload");
  };

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
        model: selectedAiModel,
        email: userEmail,
        options: selectedOptions,
        createdAt: currentDate,
      });

      // Save the data to the database *before* redirecting
      const result = await axios.post("/api/codetoimage", {
        uid: uid,
        description: userDescription,
        imageUrl: imageUrl,
        code: "", // Initial code is empty
        model: selectedAiModel,
        email: userEmail,
        options: selectedOptions,
        createdAt: currentDate,
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

  // Enhanced Toggle React Options with animation
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
    if (activeTab === "options") return selectedOptions.length > 0;
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
              Transform your visual designs into clean, production-ready React code with AI-powered generation
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border">
        <div className="flex justify-between">
          <div 
            className={`flex flex-col items-center ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('upload')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${activeTab === 'upload' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <ImageIcon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Upload</span>
          </div>
          <div className="flex-1 flex items-center px-4">
            <div className={`h-1 w-full ${activeTab !== 'upload' ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
          </div>
          <div 
            className={`flex flex-col items-center ${activeTab === 'options' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => selectedFile && setActiveTab('options')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${activeTab === 'options' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Features</span>
          </div>
          <div className="flex-1 flex items-center px-4">
            <div className={`h-1 w-full ${activeTab === 'description' ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
          </div>
          <div 
            className={`flex flex-col items-center ${activeTab === 'description' ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => selectedFile && selectedOptions.length > 0 && setActiveTab('description')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${activeTab === 'description' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <FileCode className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Description</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel - Changes based on active tab */}
        <div className="p-8 border-2 border-dashed rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 relative">
          {activeTab === 'upload' && (
            <div className="h-full">
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
                      className="max-h-64 object-contain rounded-md mb-4 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                    
                    {/* Success indicator */}
                    {showSuccessIndicator && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Image Ready!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <CloudUpload className="h-16 w-16 text-blue-500" />
                    </div>
                    <h2 className="font-bold text-xl mb-2">
                      {isDragActive ? "Drop image here" : "Upload Image"}
                    </h2>
                    <p className="text-gray-500 text-center max-w-xs mb-4">
                      Drag and drop your design image, or click to browse your files
                    </p>
                    <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg text-sm text-gray-500">
                      Supports PNG, JPG, JPEG up to 5MB
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'options' && (
            <div className="h-full">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">AI Model Selection</h2>
                <p className="text-gray-500 mb-4">Choose the AI model that best fits your needs</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedAiModel(model.name)}
                      className={`p-4 rounded-lg flex items-center gap-4 transition-all border-2 ${
                        selectedAiModel === model.name
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${model.color}`}>
                        {model.icon}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-gray-900">{model.name}</p>
                        <p className="text-sm text-gray-500">{model.description}</p>
                      </div>
                      {selectedAiModel === model.name && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {preview && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Selected Image:</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="h-full">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Describe Your Design</h2>
              <p className="text-gray-500 mb-4">Add details to help the AI understand your design better</p>
              
              <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
                className="w-full h-40 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner"
                disabled={isUploading}
              />
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {500 - userDescription.length} characters remaining
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUserDescription("")}
                  className="text-gray-500"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              
              {preview && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Selected Image:</p>
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Features and Options */}
        <div className="space-y-6">
          {/* React Features */}
          <div className="p-6 bg-white rounded-xl shadow-lg border">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600" />
              React Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REACT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
                    selectedOptions.includes(option.value)
                      ? `ring-2 ring-blue-500 ${option.color}`
                      : `${option.hoverColor} border border-gray-200`
                  }`}
                >
                  <span className={selectedOptions.includes(option.value) ? option.color : "text-gray-400"}>
                    {option.icon}
                  </span>
                  <div className="text-left">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-gray-500">
                      {option.description}
                    </p>
                  </div>
                  {selectedOptions.includes(option.value) && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          {showTips && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-100">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Pro Tips
                </h2>
                <button 
                  onClick={() => setShowTips(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="p-6 bg-white rounded-xl shadow-lg border">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Processing your image...</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">This may take a few moments</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={activeTab === 'description' ? handleUpload : goToNextStep}
          disabled={isUploading || !canProceed()}
          className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 shadow-lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Magic...
            </>
          ) : (
            <>
              {activeTab === 'description' ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate React Code
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  {activeTab === 'upload' ? 'Continue to Features' : 'Continue to Description'}
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
