"use client";
import { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  CloudUpload,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
  Trash2,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Check,
  X,
  FileImage,
  Layers,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/imageUtils';

interface ImageDropzoneProps {
  setSelectedFile: (file: File | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setActiveTab: (tab: "upload" | "options" | "description") => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Animated floating particles component
const FloatingParticles = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(
              Math.random() * 100
            ) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.3)`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 30 - 15, 0],
            scale: [1, Math.random() * 0.5 + 1, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 8 + 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  setSelectedFile,
  error,
  setError,
  setActiveTab,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoverState, setHoverState] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [showRecentImages, setShowRecentImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recent images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem('recentImages');
    if (savedImages) {
      setRecentImages(JSON.parse(savedImages));
    }
  }, []);

  // Save image to recent images
  const saveToRecentImages = useCallback((dataUrl: string) => {
    const updatedRecentImages = [dataUrl, ...recentImages.slice(0, 4)];
    setRecentImages(updatedRecentImages);
    localStorage.setItem('recentImages', JSON.stringify(updatedRecentImages));
  }, [recentImages]);

  // Handle crop complete
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply crop to image
  const applyCrop = useCallback(async () => {
    if (previewUrl && croppedAreaPixels) {
      try {
        setIsUploading(true);
        const croppedImage = await getCroppedImg(
          previewUrl,
          croppedAreaPixels,
          rotation
        );
        const croppedUrl = URL.createObjectURL(croppedImage);
        setPreviewUrl(croppedUrl);
        
        // Convert blob to file
        const fileName = 'cropped-image.jpg';
        const croppedFile = new File([croppedImage], fileName, { type: 'image/jpeg' });
        setSelectedFile(croppedFile);
        
        setIsEditMode(false);
        setIsUploading(false);
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
      } catch (error) {
        console.error('Error applying crop:', error);
        setError('Failed to crop image. Please try again.');
        setIsUploading(false);
      }
    }
  }, [previewUrl, croppedAreaPixels, rotation, setSelectedFile, setError]);

  // Handle file drop
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
          const dataUrl = reader.result as string;
          setPreviewUrl(dataUrl);
          saveToRecentImages(dataUrl);
          
          // Simulate loading for better UX
          setTimeout(() => {
            setIsUploading(false);
            setIsSuccess(true);

            // Advance to next tab after success
            setTimeout(() => {
              setIsSuccess(false);
              setActiveTab("options");
            }, 1500);
          }, 800);
        };
        reader.readAsDataURL(file);
      }
    },
    [setSelectedFile, setError, setActiveTab, saveToRecentImages]
  );

  // Use a custom open function to trigger the file input
  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Select a recent image
  const selectRecentImage = useCallback((dataUrl: string) => {
    setPreviewUrl(dataUrl);
    setIsUploading(true);
    
    // Convert data URL to file
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'recent-image.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setIsUploading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          setIsSuccess(false);
          setActiveTab("options");
        }, 1500);
      })
      .catch(err => {
        console.error('Error loading recent image:', err);
        setError('Failed to load recent image');
        setIsUploading(false);
      });
  }, [setSelectedFile, setActiveTab, setError]);

  // Reset the current edit
  const resetEdit = useCallback(() => {
    setIsEditMode(false);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
    noClick: isEditMode || !!previewUrl, // Disable click when in edit mode or preview is shown
    noKeyboard: isEditMode || !!previewUrl,
  });

  // Track drag enter/leave events for better visual feedback
  const onDragEnter = useCallback(() => {
    if (!isEditMode && !previewUrl) {
      setDragCount((prev) => prev + 1);
    }
  }, [isEditMode, previewUrl]);

  const onDragLeave = useCallback(() => {
    setDragCount((prev) => Math.max(prev - 1, 0));
  }, []);

  // Reset drag count when active state changes
  useEffect(() => {
    if (!isDragActive) {
      setDragCount(0);
    }
  }, [isDragActive]);

  // Determine if we should show drag active styles
  const showDragActiveStyles = (isDragActive || dragCount > 0) && !isEditMode && !previewUrl;

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
            ${isEditMode ? "border-indigo-500 bg-gradient-to-br from-indigo-50/80 to-purple-50/80" : ""}
           `,
          onDragEnter,
          onDragLeave,
          onMouseEnter: () => setHoverState(true),
          onMouseLeave: () => setHoverState(false),
        })}
      >
        <input {...getInputProps()} ref={fileInputRef} id="imageselect" />
        <FloatingParticles />

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
          ) : isEditMode && previewUrl ? (
            // Image Editing Mode
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col"
            >
              <div className="relative h-[calc(100%-80px)] w-full">
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Edit Image</h3>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetEdit}
                      className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyCrop}
                      className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400"
                      title="Apply"
                    >
                      <Check className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Zoom</p>
                    <div className="flex items-center space-x-2">
                      <ZoomOut className="h-3 w-3 text-gray-500" />
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <ZoomIn className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Rotation</p>
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="h-3 w-3 text-gray-500" />
                      <input
                        type="range"
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <RotateCw className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : previewUrl ? (
            // Image Preview Mode
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg border-2 border-indigo-200 dark:border-indigo-800 mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-auto object-contain bg-white dark:bg-gray-900" 
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="flex space-x-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 rounded-lg flex items-center shadow-sm transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center shadow-sm transition-colors"
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Edit
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("options")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center shadow-md hover:shadow-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Continue
                </motion.button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
                Your image is ready to be transformed into beautiful code
              </p>
            </motion.div>
          ) : (
            // Upload Mode
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
                    onClick={openFileDialog}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors mb-6 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Choose Image
                    </span>
                  </motion.button>
                  
                  {recentImages.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <button 
                        onClick={() => setShowRecentImages(!showRecentImages)}
                        className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mb-2"
                      >
                        <History className="h-4 w-4 mr-1" />
                        {showRecentImages ? 'Hide' : 'Show'} recent images
                      </button>
                      
                      {showRecentImages && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="grid grid-cols-5 gap-2 overflow-hidden"
                        >
                          {recentImages.map((img, index) => (
                            <motion.div 
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative w-12 h-12 rounded-md overflow-hidden border border-indigo-200 dark:border-indigo-800 cursor-pointer shadow-sm"
                              onClick={() => selectRecentImage(img)}
                            >
                              <img 
                                src={img} 
                                alt={`Recent ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

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
