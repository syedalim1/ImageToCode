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
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
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
  const [hoverState, setHoverState] = useState(false);

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

  // Decorative elements for empty state
  const decorativeElements = [
    { x: "10%", y: "15%", size: "8", color: "purple-500", delay: 0 },
    { x: "85%", y: "20%", size: "6", color: "pink-500", delay: 0.1 },
    { x: "75%", y: "80%", size: "10", color: "blue-500", delay: 0.2 },
    { x: "20%", y: "75%", size: "7", color: "green-500", delay: 0.3 },
  ];

  return (
    <div className="h-full">
      <div
        {...getRootProps({
          className: `relative w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden
            ${
              showDragActiveStyles
                ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30"
                : "border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-950/20 dark:hover:to-purple-950/20"
            } 
            ${error ? "border-red-400 bg-red-50 dark:bg-red-950/30" : ""} 
            ${preview ? "p-4" : "p-8"}
            ${preview ? "" : "cursor-pointer"}`,
          onDragEnter,
          onDragLeave,
          onMouseEnter: () => setHoverState(true),
          onMouseLeave: () => setHoverState(false),
        })}
      >
        <input {...getInputProps()} id="imageselect" />

        {/* Decorative background elements */}
        {!preview && !isUploading && (
          <>
            {decorativeElements.map((elem, index) => (
              <motion.div
                key={index}
                className={`absolute rounded-full bg-${elem.color} bg-opacity-20 dark:bg-opacity-40`}
                style={{
                  left: elem.x,
                  top: elem.y,
                  width: `${elem.size}px`,
                  height: `${elem.size}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: hoverState || showDragActiveStyles ? 0.8 : 0.4,
                }}
                transition={{
                  delay: elem.delay,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}

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
                  className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-1"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="bg-white dark:bg-gray-900 h-full w-full rounded-full flex items-center justify-center">
                    <motion.div
                      className="h-14 w-14 rounded-full border-4 border-indigo-500 border-t-transparent border-b-purple-600"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
              <h2 className="font-bold text-xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Processing Your Image
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-sm">
                Your creativity is being prepared for the next step
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
              <div className="relative overflow-hidden rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 max-w-full object-contain"
                />

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1.5 
                    hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <motion.button
                  onClick={open}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileImage className="h-4 w-4" />
                  <span>Change image</span>
                </motion.button>

                <span className="text-gray-300 dark:text-gray-600">|</span>

                <motion.button
                  onClick={handleContinue}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Continue</span>
                  <MoveRight className="h-4 w-4" />
                </motion.button>
              </div>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                      bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full flex items-center shadow-lg"
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
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div
                className="mb-8 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl"
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <CloudUpload className="h-12 w-12 text-white" />
              </motion.div>

              {showDragActiveStyles ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-700/20 backdrop-blur-sm rounded-xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="mb-4 mx-auto"
                    >
                      <Upload className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                    </motion.div>
                    <h2 className="font-bold text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      Drop Your Image Here
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      Let go to upload your design
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-bold text-2xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Upload Your Design
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 text-center max-w-xs mb-6">
                    Drag and drop your image file, or click below to browse
                  </p>

                  <motion.button
                    type="button"
                    onClick={open}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors mb-8 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Choose Image
                    </span>
                  </motion.button>

                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-md">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                        <Camera className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>Supports PNG, JPG, JPEG, GIF • Max 5MB</div>
                  </div>
                </>
              )}
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
            className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded-lg flex items-start shadow-md"
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
