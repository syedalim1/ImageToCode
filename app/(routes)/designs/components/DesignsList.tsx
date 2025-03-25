import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Design } from '@/types/design';

interface DesignsListProps {
  designs: Design[];
}

const DesignsList: React.FC<DesignsListProps> = ({ designs }) => {
  const router = useRouter();
  
  const handleDesignClick = (uid: string) => {
    router.push(`/designs/${uid}`);
  };

  const parseDate = (dateString: string): Date | null => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <div className="space-y-4">
      {designs.map((design: Design) => (
        <motion.div
          key={design.uid}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.99 }}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => handleDesignClick(design.uid)}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-32 bg-gray-100 relative flex-shrink-0">
              <img
                src={design.imageUrl}
                alt={design.description || "Design preview"}
                className="w-full h-full object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x400/5271ff/ffffff?text=Image+Not+Available";
                }}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {design.model}
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg mb-1">
                {design.description || "Untitled Design"}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {parseDate(design.createdAt)
                    ? new Date(design.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
                <div className="flex space-x-1">
                  {design.options &&
                    design.options.map((option: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                      >
                        {option}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DesignsList;
