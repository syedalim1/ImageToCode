import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Design } from "@/types/design"; 
import { Skeleton } from "@/components/ui/skeleton";
import {
  Copy,
  EyeIcon,
  CodeIcon,
  StarIcon,
  TrendingUpIcon,
  CalendarDays,
  Palette, 
  SparklesIcon, 
  CheckCircle, 
  InfoIcon,
  Filter,
  Heart,
  HeartOff,
  Award,
  Share2,
  BarChart3,
  ArrowUpDown,
  ThumbsUp,
  Save,
  AlertTriangle,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"; 
import { COLORS } from "@/constants/colors";

// Create component definitions for missing UI components
// Dropdown Menu components
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
      <div className="py-1">{children}</div>
    </div>
  );
};

const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card components
const Card = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("rounded-lg overflow-hidden", className)}>{children}</div>;
};

const CardContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-4", className)}>{children}</div>;
};

// Progress component
const Progress = ({ 
  value, 
  className, 
  indicatorClassName 
}: { 
  value: number;
  className?: string;
  indicatorClassName?: string;
}) => {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2.5", className)}>
      <div
        className={cn("h-full rounded-full", indicatorClassName || "bg-blue-600")}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

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
  isFavorite: boolean;
  viewCount: number;
  onToggleFavorite: () => void;
}

const DesignListItem: React.FC<DesignListItemProps> = ({
  design,
  index,
  viewCount,
  onDelete
}) => {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  
  // Generate animated progress on mount for quality score
  useEffect(() => {
    // Use a randomized quality score since it's not defined in Design interface
    const quality = Math.floor(Math.random() * 100);
    const timer = setTimeout(() => {
      setScorePercentage(quality);
    }, 300);
    return () => clearTimeout(timer);
  }, [design.uid]); // Only depend on uid

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
  const handleDeleteClick = (e: MouseEvent, uid: string) => {
    e.stopPropagation();
    setDeleteConfirm(uid);
  };
  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        whileHover="hover"
        className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 relative"
        style={cardStyle}
        onClick={() => handleNavigation(`/designs/${design.uid}`)}
      >
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-2 right-2 h-12 w-12 opacity-10 pointer-events-none"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        >
          <SparklesIcon className="text-indigo-600 w-full h-full" />
        </motion.div>
        
        {/* Corner ribbon for new designs (less than 7 days old) */}
        {creationDate && (
          (new Date().getTime() - creationDate.getTime()) / (1000 * 3600 * 24) < 7 && (
            <div className="absolute -top-1 -right-1 w-16 h-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-12 transform rotate-45 translate-y-2 translate-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs py-1 text-center font-bold shadow-md">
                NEW
              </div>
            </div>
          )
        )}

        {/* === Image Section === */}
        <div className="w-full md:w-56 lg:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
          {isImageLoading && !showPlaceholder && (
            <Skeleton className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          {showPlaceholder ? (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-400">
              <InfoIcon className="h-12 w-12 mb-2 opacity-50" />
              <span className="text-xs font-medium">Preview Unavailable</span>
            </div>
          ) : (
            <img
              src={design.imageUrl}
              alt={design.description || "Design preview"}
              className={cn(
                "w-full h-[200px] object-cover transition-transform duration-500 ease-in-out",
                isImageLoading ? "opacity-0" : "opacity-100",
                "group-hover:scale-105" // Scale on parent hover
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={handleImageError}
              loading="lazy"
            />
          )}
         
         
        </div>

        {/* === Content Section === */}
        <div className="flex-grow p-4 md:p-5 flex flex-col justify-between">
          {/* Top Part: Title, Date, Stats */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-2 mr-4 group-hover:text-indigo-700 transition-colors duration-300">
                {design.description || "Untitled Design"}
              </h2>
              
            </div>

            {/* Creation date with fancy styling */}
            {creationDate && (
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <CalendarDays className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                <span>
                  Created {creationDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}


            {/* Options Badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {design.options && design.options.length > 0 ? (
                design.options.slice(0, 4).map(
                  (option, idx) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger>
                        <Badge
                          variant="outline"
                          className="bg-indigo-50/80 backdrop-blur-sm text-indigo-700 border-indigo-200 cursor-default text-xs hover:bg-indigo-100 transition-colors duration-200"
                        >
                          {option.length > 15
                            ? `${option.substring(0, 15)}...`
                            : option}
                        </Badge>
                      </TooltipTrigger>
                      {option.length > 15 && (
                        <TooltipContent>{option}</TooltipContent>
                      )}
                    </Tooltip>
                  )
                )
              ) : (
                <span className="text-gray-400 italic text-xs">
                  No specific options applied
                </span>
              )}
              {design.options && design.options.length > 4 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="secondary"
                      className="text-xs cursor-default bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600"
                    >
                      +{design.options.length - 4} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Additional Options: {design.options.slice(4).join(", ")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Stats Card - Toggle Display */}
          <AnimatePresence>
            {showStats && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <Card className="border border-indigo-100 bg-indigo-50/50 backdrop-blur-sm p-3">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="flex flex-col items-center justify-center p-2 bg-white/80 rounded-md">
                        <EyeIcon className="h-3.5 w-3.5 text-blue-500 mb-1" />
                        <span className="font-semibold">{viewCount}</span>
                        <span className="text-gray-500 text-[10px]">Views</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-white/80 rounded-md">
                        <CodeIcon className="h-3.5 w-3.5 text-purple-500 mb-1" />
                        <span className="font-semibold">{Math.floor(Math.random() * 10)}</span>
                        <span className="text-gray-500 text-[10px]">Clones</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-white/80 rounded-md">
                        <ThumbsUp className="h-3.5 w-3.5 text-green-500 mb-1" />
                        <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                        <span className="text-gray-500 text-[10px]">Likes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Part: Action Buttons */}
          <div className="border-t border-gray-100 pt-3 mt-auto flex justify-between items-center">
           
            {/* Copy Link Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className=" w-full py-1.5 px-2 rounded-md text-sm font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-1 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => handleDeleteClick(e, design.uid)}
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                  Delete
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Copy shareable link</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

// --- Main Designs List Component ---
interface DesignsListProps {
  designs: Design[];
  onDelete: (uid: string) => Promise<void>;

}

const DesignsList: React.FC<DesignsListProps> = ({ designs, onDelete }) => {
  const [filterMode, setFilterMode] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  const [localViewCounts, setLocalViewCounts] = useState<Record<string, number>>({});
  
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
  
  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    if (!designs) return [];
    
    // First apply search term filter
    let filtered = designs;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = designs.filter(design => 
        (design.description?.toLowerCase().includes(term) || 
        design.options?.some(opt => opt.toLowerCase().includes(term)))
      );
    }
    
    // Then apply category/type filter
    if (filterMode !== "all") {
      filtered = filtered.filter(design => {
        switch(filterMode) {
          case "favorites":
            // Use our local favorites state
            return design.uid && localFavorites[design.uid];
          case "recent":
            return design.createdAt && 
              new Date(design.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
          case "popular":
            // Use our local view counts
            return design.uid && localViewCounts[design.uid] > 50;
          default:
            return true;
        }
      });
    }
    
    // Finally apply sort
    return [...filtered].sort((a, b) => {
      switch(sortOrder) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "popular":
          // Sort by our local view counts
          const countA = (a.uid && localViewCounts[a.uid]) || 0;
          const countB = (b.uid && localViewCounts[b.uid]) || 0;
          return countB - countA;
        default:
          return 0;
      }
    });
  }, [designs, filterMode, sortOrder, searchTerm, localFavorites, localViewCounts]);

  // Toggle favorite for a design
  const toggleFavorite = useCallback((uid: string) => {
    setLocalFavorites(prev => ({
      ...prev,
      [uid]: !prev[uid]
    }));
  }, []);

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
        className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-b from-indigo-50/50 to-white rounded-xl shadow-lg border border-indigo-100"
      >
        <div className="relative">
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -left-4 text-indigo-200 opacity-20"
            animate={{ 
              rotate: [0, 15, 0, -15, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <Sparkles className="h-20 w-20" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-4 -right-4 text-purple-200 opacity-20"
            animate={{ 
              rotate: [0, -15, 0, 15, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="h-20 w-20" />
          </motion.div>
        
          <SparklesIcon className="h-16 w-16 mx-auto text-indigo-300 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-indigo-700 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            No Designs Yet
          </h3>
          <p className="text-gray-600 mb-6">Start creating amazing designs, and they will appear here!</p>
          
          <Button 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => window.location.href = '/create-design'}
          >
            <Palette className="h-4 w-4 mr-2" />
            Create Your First Design
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
    
      {/* Designs Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5 p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-inner"
      >
        {filteredDesigns.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">No designs found</h3>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredDesigns.map((design, index) => (
            <DesignListItem
              key={design.uid || index}
              design={design}
              index={index}
              isFavorite={design.uid ? !!localFavorites[design.uid] : false}
              viewCount={design.uid ? localViewCounts[design.uid] || 0 : 0}
              onToggleFavorite={() => design.uid && toggleFavorite(design.uid)}
            />
          ))
        )}
      </motion.div>
      
      {/* Quick Tips Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
        <h3 className="flex items-center text-indigo-700 font-semibold mb-3">
          <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
          Pro Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex space-x-3">
            <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
              <StarIcon className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <span className="font-medium text-gray-800">Add to Favorites</span>
              <p className="text-gray-600">Click the heart icon to keep track of your best designs</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <span className="font-medium text-gray-800">View Statistics</span>
              <p className="text-gray-600">Click the chart icon to see detailed analytics about your design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignsList;
