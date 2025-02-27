"use client";

import React from 'react';
import ImageUpload from './_component/ImageUpload';
import { motion } from 'framer-motion';

function Dashboard() {
    return (
        <motion.div 
            className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-full overflow-x-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <ImageUpload />
        </motion.div>
    );
}

export default Dashboard;
