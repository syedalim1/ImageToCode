import React, { useState, MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, Share2, Download, Star, Info, Code, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast, ToastOptions } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/design';
import { COLORS } from '@/constants/colors';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface DesignsGridProps {
  designs: Design[];
  onDelete: (uid: string) => Promise<void>;
}

const DesignsGrid: React.FC<DesignsGridProps> = ({ designs, onDelete }) => {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showQuickView, setShowQuickView] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for hover effects
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteDesigns');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleDesignClick = (uid: string) => {
    router.push(`/designs/${uid}`);
  };

  const handleDeleteClick = (e: MouseEvent, uid: string) => {
    e.stopPropagation();
    setDeleteConfirm(uid);
  };

  const handleQuickView = (e: MouseEvent, design: Design) => {
    e.stopPropagation();
    setSelectedDesign(design);
    setShowQuickView(true);
  };

  const toggleFavorite = (e: MouseEvent, uid: string) => {
    e.stopPropagation();
    let newFavorites;
    
    if (favorites.includes(uid)) {
      newFavorites = favorites.filter(id => id !== uid);
      toast.info("Removed from favorites", { autoClose: 2000 });
    } else {
      newFavorites = [...favorites, uid];
      toast.success("Added to favorites", { autoClose: 2000 });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteDesigns', JSON.stringify(newFavorites));
  };

  const handleShare = (e: MouseEvent, design: Design) => {
    e.stopPropagation();
    // Copy share link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/designs/${design.uid}`);
    toast.success("Share link copied to clipboard!", { autoClose: 2000 });
  };

  const handleExport = (e: MouseEvent, design: Design) => {
    e.stopPropagation();
    toast.info("Preparing design export...", { autoClose: 2000 });
    
    // Simulate export process
    setTimeout(() => {
      toast.success("Design exported successfully!", { autoClose: 3000 });
    }, 1500);
  };

  const confirmDelete = (uid: string) => {
    onDelete(uid)
      .then(() => {
        toast.success("Design deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } as ToastOptions);
      })
      .catch(() => {
        toast.error("Failed to delete design", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } as ToastOptions);
      })
      .finally(() => {
        setDeleteConfirm(null);
      });
  };

  const parseDate = (dateString: string): Date | null => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <>
      {/* Floating interactive background element */}
      <motion.div 
        className="fixed w-80 h-80 rounded-full filter blur-3xl opacity-10 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          zIndex: 0,
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 20,
          mass: 0.8
        }}
      />

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {designs.map((design) => (
          <motion.div
            key={design.uid}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            className="backdrop-blur-sm bg-white/90 rounded-xl overflow-hidden shadow-lg dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
            onClick={() => handleDesignClick(design.uid)}
          >
            {/* Decorative corner elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-200/30 rounded-full blur-xl group-hover:bg-indigo-300/40 transition-all duration-500"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-200/30 rounded-full blur-xl group-hover:bg-purple-300/40 transition-all duration-500"></div>
            
            {/* Favorite Star */}
            <div className="absolute top-2 left-2 z-10">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-full ${
                  favorites.includes(design.uid) 
                    ? 'bg-yellow-400 text-white' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-yellow-400'
                } shadow-sm transition-colors duration-200`}
                onClick={(e) => toggleFavorite(e, design.uid)}
              >
                <Star className="w-4 h-4" fill={favorites.includes(design.uid) ? "currentColor" : "none"} />
              </motion.button>
            </div>
            
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
              {/* Image overlay with animation on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 z-10">
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-indigo-600 shadow-sm transition-colors"
                    onClick={(e) => handleQuickView(e, design)}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-indigo-600 shadow-sm transition-colors"
                    onClick={(e) => handleShare(e, design)}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:text-indigo-600 shadow-sm transition-colors"
                    onClick={(e) => handleExport(e, design)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
              
              <img
                src={design.imageUrl}
                alt={design.description || "Design preview"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
                }}
              />
              
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                {design.model}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <motion.h3 
                  className="font-semibold text-lg truncate text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {design.description || "Untitled Design"}
                </motion.h3>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <motion.span 
                    className="inline-block mr-1"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </motion.span>
                  {parseDate(design.createdAt)
                    ? new Date(design.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>

                <div className="flex space-x-1">
                  {design.options &&
                    design.options
                      .slice(0, 3)
                      .map((option: string, idx: number) => (
                        <motion.span
                          key={idx}
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          whileHover={{ scale: 1.5 }}
                          whileTap={{ scale: 0.8 }}
                        ></motion.span>
                      ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-2">
                <motion.button 
                  className="flex-1 py-1.5 px-2 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md transition-all flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDesignClick(design.uid)}
                >
                  <Code className="w-3.5 h-3.5" />
                  View Code
                </motion.button>
                
                <motion.button
                  className="flex-1 py-1.5 px-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-1 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => handleDeleteClick(e, design.uid)}
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && selectedDesign && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full mx-4 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedDesign.imageUrl}
                  alt={selectedDesign.description || "Design preview"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
                  }}
                />
                <button
                  className="absolute top-3 right-3 bg-black/70 text-white p-1.5 rounded-full"
                  onClick={() => setShowQuickView(false)}
                >
                  <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                    ✕
                  </motion.span>
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {selectedDesign.description || "Untitled Design"}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {parseDate(selectedDesign.createdAt)
                        ? new Date(selectedDesign.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Model</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                      <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                      {selectedDesign.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Unique ID</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {selectedDesign.uid}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Options</p>
                    <div className="flex space-x-2">
                      {selectedDesign.options &&
                        selectedDesign.options.map((option: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          ></span>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    onClick={() => {
                      setShowQuickView(false);
                      handleDesignClick(selectedDesign.uid);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Design
                  </Button>
                  
                  <Button
                    className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowQuickView(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <DeleteConfirmationModal
        isOpen={deleteConfirm !== null}
        designUid={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DesignsGrid;
