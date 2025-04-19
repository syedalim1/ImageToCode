"use client";

import React from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import ImageUpload from './_component/ImageUpload';
import { motion } from 'framer-motion';

function Dashboard() {


    return (
        <div className='w-full  px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-full overflow-x-hidden relative'>
            <SignedIn>
                {/* Content only visible to signed in users */}
                <motion.div 
                    className='w-full h-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <ImageUpload />
                </motion.div>
            </SignedIn>
            
            <SignedOut>
                {/* Content only visible to signed out users */}
                <motion.div
                    className="flex flex-col items-center justify-center min-h-[70vh] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-6">Authentication Required</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        Please sign in to access the dashboard and start converting your designs to code.
                    </p>
                    
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                        <SignInButton mode="modal">
                            Sign In to Continue
                        </SignInButton>
                    </div>
                </motion.div>
            </SignedOut>
        </div>
    );
}

export default Dashboard;
