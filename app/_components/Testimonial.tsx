"use client";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/outline";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, company, image, rating }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 relative"
    >
      <div className="absolute -top-6 left-8">
        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src={image} alt={author} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex mb-4 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-5 w-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic mb-4">"{quote}"</p>
      <div>
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-sm text-gray-500">
          {role}, {company}
        </p>
      </div>
    </motion.div>
  );
};

export default Testimonial;
