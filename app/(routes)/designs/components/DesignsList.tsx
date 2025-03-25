import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Design } from "@/types/design";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Copy,
  EyeIcon,
  CodeIcon,
  StarIcon,
  TrendingUpIcon,
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

interface DesignsListProps {
  designs: Design[];
}

const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const DesignListItem: React.FC<{
  design: Design;
  index: number;
  onClick: (uid: string) => void;
}> = ({ design, index, onClick }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = (event: React.MouseEvent) => {
    event.stopPropagation();
    const url = `${window.location.origin}/view-code/${design.uid}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copied to clipboard!", { autoClose: 2000 });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link.");
      });
  };

  const complexityScore = design.options ? design.options.length * 20 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
      }}
      className="flex bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-4 transition-all duration-300 hover:border-indigo-200"
      onClick={() => onClick(design.uid)}
    >
      {/* Image Section with Advanced Styling */}
      <div className="w-64 relative group">
        {isImageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={design.imageUrl}
          alt={design.description || "Design preview"}
          className={`w-full h-64 object-cover transition-all duration-300 ${
            isImageLoading ? "opacity-0 blur-sm" : "opacity-100 blur-none"
          } group-hover:scale-105`}
          onLoad={() => setIsImageLoading(false)}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            setIsImageLoading(false);
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x400/E0E7FF/4F46E5?text=Preview+Unavailable";
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Badge variant="secondary" className="bg-indigo-500 text-white">
            {design.model}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-600"
                >
                  <StarIcon className="h-3 w-3 mr-1" />
                  {complexityScore}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Design Complexity Score</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content Section with Rich Information */}
      <div className="flex-grow p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {design.description || "Untitled Design"}
            </h2>
            <div className="flex items-center space-x-2">
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {parseDate(design.createdAt)
                  ? new Date(design.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </span>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            {design.options && design.options.length > 0 ? (
              design.options.slice(0, 5).map((option: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-indigo-50 text-indigo-700 border-indigo-200"
                >
                  {option}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 italic">No options defined</span>
            )}
            {design.options && design.options.length > 5 && (
              <Badge variant="secondary">
                +{design.options.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="flex space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-indigo-600"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview Design</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-green-600"
                  >
                    <CodeIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  className="text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy shareable link to this design
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );
};

const DesignsList: React.FC<DesignsListProps> = ({ designs }) => {
  const router = useRouter();

  const handleDesignClick = (uid: string) => {
    router.push(`/view-code/${uid}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 bg-gray-50 rounded-xl">
      {designs.map((design, index) => (
        <DesignListItem
          key={design.uid}
          design={design}
          index={index}
          onClick={handleDesignClick}
        />
      ))}
    </div>
  );
};

export default DesignsList;
