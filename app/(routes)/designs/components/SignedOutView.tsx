import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/nextjs';
import { ExternalLink, Sparkles, Code2 } from 'lucide-react';

const SignedOutView: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background decorations */}
      <div className="absolute inset-0 z-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 5 + 5,
            }}
          />
        ))}
      </div>

      {/* Gradient blob following mouse */}
      <motion.div
        className="absolute w-80 h-80 rounded-full filter blur-3xl opacity-30 z-0"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        }}
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 20,
        }}
      />
      
      <div className="z-10 backdrop-blur-sm bg-white/30 p-10 rounded-2xl shadow-2xl border border-white/20">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-70 animate-pulse" />
            <div className="relative h-24 w-24 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <h1 className="text-4xl font-extrabold mb-6 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Your Designs Collection
          </span>
          <motion.span 
            className="absolute -top-1 -right-1 text-yellow-500"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </h1>
        
        <p className="text-gray-700 mb-8 max-w-md">
          Please sign in to view your design collection and conversion
          history. Unlock powerful features to manage and enhance your designs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200" />
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg flex items-center gap-2">
              <SignInButton mode="modal">Sign In to View Designs</SignInButton>
            </div>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
          >
            <Code2 className="w-4 h-4" />
            View Demo
          </motion.button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-4">
          <motion.a 
            href="#"
            whileHover={{ y: -3 }}
            className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1"
          >
            Documentation <ExternalLink className="h-3 w-3" />
          </motion.a>
          <motion.a 
            href="#"
            whileHover={{ y: -3 }}
            className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1"
          >
            Support <ExternalLink className="h-3 w-3" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default SignedOutView;
