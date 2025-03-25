// import React from "react";
// import { Button } from "@/components/ui/button";
// import { RefreshCw } from "lucide-react";
// import { motion } from "framer-motion";
// import { ErrorStateProps } from "./types";

// function ErrorState({ error, retryFn }: ErrorStateProps) {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gradient-to-r from-red-50 to-pink-50 p-8">
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
//       >
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-8 h-8 text-red-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </div>
//         </div>
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
//           Oops! Something went wrong
//         </h2>
//         <p className="text-red-500 text-center mb-6">{error}</p>
//         <Button
//           onClick={retryFn}
//           className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all"
//         >
//           <RefreshCw className="mr-2 h-4 w-4" /> Try Again
//         </Button>
//       </motion.div>
//     </div>
//   );
// }

// export default ErrorState;
