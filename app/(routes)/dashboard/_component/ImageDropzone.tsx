"use client";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CloudUpload,
  X,
  CheckCircle,
  AlertCircle,
  FileImage,
  MoveRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageDropzoneProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setShowSuccessIndicator: (show: boolean) => void;
  setActiveTab: (tab: "upload" | "options" | "description") => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  selectedFile,
  setSelectedFile,
  preview,
  setPreview,
  error,
  setError,
  setShowSuccessIndicator,
  setActiveTab,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setError("Please upload an image file (PNG, JPG, JPEG, GIF)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("File size exceeds 5MB limit");
          return;
        }

        setIsUploading(true);
        setSelectedFile(file);
        setError(null);

        const reader = new FileReader();
        reader.onload = () => {
          // Simulate loading for better UX
          setTimeout(() => {
            setPreview(reader.result as string);
            setIsUploading(false);
            setIsSuccess(true);
            setShowSuccessIndicator(true);

            // Advance to next tab after success
            setTimeout(() => {
              setIsSuccess(false);
              setShowSuccessIndicator(false);
              setActiveTab("options");
            }, 1500);
          }, 800);
        };
        reader.readAsDataURL(file);
      }
    },
    [
      setSelectedFile,
      setPreview,
      setError,
      setShowSuccessIndicator,
      setActiveTab,
    ]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
    noClick: !!preview, // Disable click when preview exists
  });

  // Track drag enter/leave events for better visual feedback
  const onDragEnter = useCallback(() => {
    setDragCount((prev) => prev + 1);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragCount((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab("options");
  };

  // Reset drag count when active state changes
  useEffect(() => {
    if (!isDragActive) {
      setDragCount(0);
    }
  }, [isDragActive]);

  // Determine if we should show drag active styles
  const showDragActiveStyles = isDragActive || dragCount > 0;

  return (
    <div className="h-full">
      <div
        {...getRootProps({
          className: `w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 
            ${
              showDragActiveStyles
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                : "border-gray-300 dark:border-gray-700"
            } 
            ${error ? "border-red-400 bg-red-50 dark:bg-red-950/30" : ""} 
            ${preview ? "p-6" : "p-8"}
            ${
              preview
                ? ""
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            }`,
          onDragEnter,
          onDragLeave,
        })}
      >
        <input {...getInputProps()} id="imageselect" />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 relative">
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h2 className="font-bold text-xl mb-2">Uploading Image...</h2>
              <p className="text-gray-500 text-center">
                Please wait while we process your image
              </p>
            </motion.div>
          ) : preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group flex flex-col items-center"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 max-w-full object-contain"
                />

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1.5 
                    hover:bg-red-600 transition-colors group-hover:opacity-100 opacity-0 focus:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={open}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <FileImage className="h-4 w-4" />
                  <span>Change image</span>
                </button>

                <span className="text-gray-300">|</span>

                <button
                  onClick={handleContinue}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <span>Continue</span>
                  <MoveRight className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                      bg-green-500 text-white px-4 py-2 rounded-full flex items-center shadow-lg"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">
                      Image Uploaded Successfully!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/40 rounded-full"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <CloudUpload className="h-12 w-12 text-blue-500 dark:text-blue-400" />
              </motion.div>

              <h2 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200">
                {showDragActiveStyles
                  ? "Drop to Upload Image"
                  : "Upload Your Image"}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mb-6">
                Drag and drop your design image, or click to browse your files
              </p>

              <motion.button
                type="button"
                onClick={open}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-6"
                whileTap={{ scale: 0.97 }}
              >
                Browse Files
              </motion.button>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-3 rounded-lg text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                Supports PNG, JPG, JPEG, GIF • Max 5MB
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded-lg flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageDropzone;
