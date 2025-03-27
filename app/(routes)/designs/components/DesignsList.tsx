import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Design } from "@/types/design";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EyeIcon,
  CodeIcon,
  StarIcon,
  CalendarDays,

  SparklesIcon,
  InfoIcon,
  
  Sparkles,
  Trash2,
  ShieldAlert,
  AlertCircle,
 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast, ToastOptions } from "react-toastify";

// --- Helper Functions ---
const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Generate dynamic background gradient based on design ID for more uniqueness
const generateDynamicGradient = (uid: string): string => {
  // Create colors based on the uid characters
  const hash = uid.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 7) % 360;

  return `linear-gradient(135deg, hsla(${hue1}, 80%, 60%, 0.08), hsla(${hue2}, 80%, 60%, 0.12))`;
};

// Floating animation for decorative elements
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- Design List Item Component ---
interface DesignListItemProps {
  design: Design;
  index: number;
  onDelete: (uid: string) => Promise<void>;
}

const DesignListItem: React.FC<DesignListItemProps> = ({
  design,
  index,
  onDelete,
}) => {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    setDeleteConfirm(uid);
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

  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent triggering other click events if nested
    router.push(path);
  };

  const creationDate = useMemo(
    () => parseDate(design.createdAt),
    [design.createdAt]
  );

  const handleImageError = () => {
    setIsImageLoading(false);
    setShowPlaceholder(true);
  };

  // Style based on dynamic gradient
  const cardStyle = {
    background: generateDynamicGradient(design.uid || '0'),
  };

  return (
    <div className="w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        whileHover="hover"
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:-translate-y-1 relative"
        style={cardStyle}
        onClick={() => handleNavigation(`/designs/${design.uid}`)}
      >
        {/* Glassmorphism effect overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none"></div>
        
        {/* Decorative floating dots */}
        <motion.div 
          className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 z-0 pointer-events-none"
          variants={floatingAnimation}
          animate="animate"
        />
        <motion.div 
          className="absolute -left-3 -bottom-3 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 z-0 pointer-events-none"
          variants={floatingAnimation}
          animate="animate"
          transition={{ delay: 0.5 }}
        />

        {/* Corner ribbon for new designs (less than 7 days old) */}
        {creationDate && (
          (new Date().getTime() - creationDate.getTime()) / (1000 * 3600 * 24) < 7 && (
            <div className="absolute -top-1 -right-1 w-16 h-16 overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-16 transform rotate-45 translate-y-2 translate-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs py-1 text-center font-bold shadow-md">
                NEW
              </div>
            </div>
          )
        )}

        {/* === Image Section === */}
        <div className="w-full h-44 sm:h-48 relative overflow-hidden flex-shrink-0">
          {isImageLoading && !showPlaceholder && (
            <Skeleton className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
          )}
          {showPlaceholder ? (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-400 dark:text-indigo-300">
              <InfoIcon className="h-12 w-12 mb-2 opacity-50" />
              <span className="text-xs font-medium">Preview Unavailable</span>
            </div>
          ) : (
            <img
              src={design.imageUrl}
              alt={design.description || "Design preview"}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 ease-in-out",
                isImageLoading ? "opacity-0" : "opacity-100",
                "group-hover:scale-105" // Scale on parent hover
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={handleImageError}
              loading="lazy"
            />
          )}

          {/* Hover Overlay with Quick Actions */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex gap-2 justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(`/view-code/${design.uid}`, e);
                      }}
                    >
                      <CodeIcon className="w-4 h-4" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">View Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
          
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/70 transition-colors"
                      onClick={(e) => handleDeleteClick(e, design.uid)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Delete Design</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </div>

        {/* === Content Section === */}
        <div className="flex-grow p-4 flex flex-col justify-between">
          {/* Title and Stats Section */}
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight line-clamp-2 mr-4 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {design.description || "Untitled Design"}
            </h2>

          
          </div>

          {/* Action Buttons */}
          <div className="mt-4 ">
        
            <motion.button
              className=" w-full p-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-1 "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleDeleteClick(e, design.uid)}
            >
              <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
              Delete
            </motion.button>
          </div>
          {deleteConfirm !== null && deleteConfirm === design.uid && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20 rounded-xl overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirm(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                  }}
                  className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 w-[90%] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-700/50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>

                  <div className="relative text-center">
                    <motion.div
                      className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden"
                      initial={{ rotate: 0 }}
                      animate={{
                        rotate: [0, -5, 0, 5, 0],
                        scale: [1, 1.05, 1, 1.05, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 to-transparent"></div>
                      <AlertCircle className="w-6 h-6 text-white drop-shadow-lg" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-base font-bold mb-6 text-gray-900 dark:text-white  flex items-center justify-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        Delete?
                      </h3>

                    </motion.div>

                    <div className="flex justify-center gap-3">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(null);
                          }}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 text-xs rounded-lg shadow-sm transition-all duration-200"
                        >
                          Cancel
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg blur opacity-60 group-hover:opacity-80 transition duration-200"></div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(deleteConfirm as string);
                          }}
                          className="relative bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-3 py-1 text-xs rounded-lg shadow-md transition-all duration-200"
                        >
                          Delete
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

        </div>

        {/* Animated Delete Confirmation Modal */}
        
      </motion.div>
    </div>
  );
};

// --- Main Designs List Component ---
interface DesignsListProps {
  designs: Design[];
  onDelete: (uid: string) => Promise<void>;
}

const DesignsList: React.FC<DesignsListProps> = ({ designs, onDelete }) => {
  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  const [localViewCounts, setLocalViewCounts] = useState<Record<string, number>>({});
  const [sortOption, setSortOption] = useState<'date' | 'favorites' | 'views'>('date');

  // Initialize random view counts for each design
  useEffect(() => {
    if (designs && designs.length > 0) {
      const viewCounts: Record<string, number> = {};
      designs.forEach(design => {
        if (design.uid) {
          viewCounts[design.uid] = Math.floor(Math.random() * 100);
        }
      });
      setLocalViewCounts(viewCounts);
    }
  }, [designs]);

 

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!designs || designs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-gray-800/20 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/30"
      >
        <div className="relative">
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -left-4 text-indigo-200 dark:text-indigo-700 opacity-20"
            animate={{
              rotate: [0, 15, 0, -15, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Sparkles className="h-20 w-20" />
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -right-4 text-purple-200 dark:text-purple-700 opacity-20"
            animate={{
              rotate: [0, -15, 0, 15, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="h-20 w-20" />
          </motion.div>

          <SparklesIcon className="h-16 w-16 mx-auto text-indigo-300 dark:text-indigo-500 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            No Designs Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Start creating amazing designs, and they will appear here!</p>
          
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all hover:shadow-lg"
            onClick={() => window.location.href = '/'}
          >
            Create Your First Design
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Sorting and View Options */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sort by:</span>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOption('date')}
              className={`text-xs px-3 py-1 rounded-md transition-all ${
                sortOption === 'date' 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Newest
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOption('favorites')}
              className={`text-xs px-3 py-1 rounded-md transition-all ${
                sortOption === 'favorites' 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <StarIcon className="h-3.5 w-3.5 mr-1" />
              Favorites
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOption('views')}
              className={`text-xs px-3 py-1 rounded-md transition-all ${
                sortOption === 'views' 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              Popular
            </Button>
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-wrap -mx-2"
      >
        {designs.map((design, index) => (
          <DesignListItem
            key={design.uid || index}
            design={design}
            index={index}
            onDelete={onDelete}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default DesignsList;
