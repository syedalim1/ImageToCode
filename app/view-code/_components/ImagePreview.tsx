"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2
} from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  altText?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  altText = "Original design image" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and rotation when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setZoomLevel(1);
      setRotation(0);
    }
  }, [isOpen]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (isOpen && isImageLoaded) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isImageLoaded, zoomLevel, rotation]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
    setShowControls(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    setShowControls(true);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
    setShowControls(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'original-design-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Original Design Image',
          text: 'Check out this design image!',
          url: imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        title="View the original image that was used to generate code"
      >
        <ImageIcon className="h-5 w-5" />
        <span className="font-medium">View Original Image</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isFullscreen && setIsOpen(false)}
          >
            <motion.div
              className={`relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${
                isFullscreen ? "w-full h-full" : "max-w-4xl max-h-[85vh]"
              } shadow-2xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Original Design Image
                </h3>
                <div className="flex gap-2">
                  <motion.button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              
              <div 
                className={`overflow-auto ${isFullscreen ? "h-[calc(100%-56px)]" : "max-h-[65vh]"} bg-gray-50 dark:bg-gray-900 relative`}
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
              >
                <div className="relative flex items-center justify-center min-h-[300px]">
                  <motion.img
                    src={imageUrl}
                    alt={altText}
                    className="object-contain transition-all"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isImageLoaded ? 1 : 0,
                      scale: zoomLevel,
                      rotate: rotation
                    }}
                    transition={{ 
                      opacity: { delay: 0.2 },
                      scale: { type: "spring", stiffness: 300, damping: 25 },
                      rotate: { type: "spring", stiffness: 300, damping: 25 }
                    }}
                    style={{ 
                      maxHeight: isFullscreen ? "calc(100vh - 120px)" : "60vh",
                      transformOrigin: "center center"
                    }}
                    onLoad={() => setIsImageLoaded(true)}
                    draggable={false}
                  />
                  
                  {!isImageLoaded && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="animate-pulse flex flex-col items-center">
                        <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Loading image...</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {showControls && isImageLoaded && (
                  <motion.div 
                    className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      onClick={handleZoomOut}
                      className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={zoomLevel <= 0.5}
                      title="Zoom out"
                    >
                      <ZoomOut className="h-5 w-5" />
                    </motion.button>
                    
                    <div className="text-white text-sm font-medium px-2">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                    
                    <motion.button
                      onClick={handleZoomIn}
                      className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={zoomLevel >= 3}
                      title="Zoom in"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </motion.button>
                    
                    <div className="w-px h-6 bg-white/30 mx-1"></div>
                    
                    <motion.button
                      onClick={handleRotate}
                      className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Rotate image"
                    >
                      <RotateCw className="h-5 w-5" />
                    </motion.button>
                    
                    <div className="w-px h-6 bg-white/30 mx-1"></div>
                    
                    <motion.button
                      onClick={handleDownload}
                      className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Download image"
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={handleShare}
                      className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Share image"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p>This is the original image that was used to generate the code. Move your cursor to show image controls.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImagePreview;
