"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code, Image, Star, FileCode, Zap, LayoutTemplate } from 'lucide-react';

// Define FAQ structured data for SEO
const FAQPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ImageToCode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode is an AI-powered tool that converts designs, mockups, screenshots, and images into production-ready HTML, CSS, React, and Next.js code. Created by CodeNovaTech, it helps designers and developers bridge the gap between design and implementation quickly."
      }
    },
    {
      "@type": "Question",
      "name": "How does ImageToCode convert images to code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode uses advanced AI vision models to analyze your design images, identify UI elements, layout structures, colors, and text. Then it generates clean, well-structured code that matches your design with high accuracy. The process takes just seconds compared to hours of manual coding."
      }
    },
    {
      "@type": "Question",
      "name": "What file formats does ImageToCode support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode supports various image formats including PNG, JPG, JPEG, WebP, and even PDF screenshots. You can upload design files, screenshots from Figma, Adobe XD, or any other design tool."
      }
    },
    {
      "@type": "Question",
      "name": "Can ImageToCode generate responsive designs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! ImageToCode generates fully responsive code by default. The AI recognizes responsive patterns and applies appropriate CSS techniques like flexbox, grid layouts, and media queries to ensure your design works well on all screen sizes."
      }
    },
    {
      "@type": "Question",
      "name": "What code languages and frameworks does ImageToCode support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode can generate code in various formats including HTML/CSS, React.js, Next.js, and more. You can choose your preferred output format before generating the code."
      }
    },
    {
      "@type": "Question",
      "name": "Is ImageToCode free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode offers both free and premium plans. The free plan allows you to convert a limited number of designs per month with standard features. Premium plans provide more conversions, additional export options, priority processing, and advanced customization."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate is the generated code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode achieves remarkably high accuracy in matching designs. The AI is continuously improved and trained on thousands of UI designs and code patterns. For most designs, you'll get 90%+ accuracy, requiring minimal adjustments to match your exact needs."
      }
    },
    {
      "@type": "Question",
      "name": "Can I export the generated code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can export the generated code in multiple formats. You can copy code snippets directly, download full project files, or export to specialized formats like JSX, TSX, HTML, or as a complete project structure with all necessary files."
      }
    },
    {
      "@type": "Question",
      "name": "How is ImageToCode different from other AI code generators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode specializes in design-to-code conversion with unmatched accuracy. Unlike general AI code generators, our solution understands design principles, UI/UX patterns, and generates clean, maintainable code following best practices. We also offer design analysis, code explanations, and performance optimization suggestions."
      }
    },
    {
      "@type": "Question",
      "name": "Who created ImageToCode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ImageToCode was created by CodeNovaTech, a team of experienced developers and AI specialists focused on creating tools that bridge the gap between design and development using artificial intelligence."
      }
    }
  ]
};

// FAQ Categories for better organization
const faqCategories = [
  {
    title: "General",
    icon: Image,
    color: "from-blue-500 to-sky-400",
    questions: [0, 1, 9]
  },
  {
    title: "Features & Capabilities",
    icon: Star,
    color: "from-amber-500 to-orange-400",
    questions: [2, 3, 4, 6]
  },
  {
    title: "Pricing & Export",
    icon: FileCode,
    color: "from-emerald-500 to-teal-400",
    questions: [5, 7]
  },
  {
    title: "Comparisons",
    icon: LayoutTemplate,
    color: "from-purple-500 to-violet-400",
    questions: [8]
  }
];

const FAQPage = () => {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
     
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about ImageToCode, the #1 AI tool for transforming designs into production-ready code.
          </p>
        </div>

        {/* FAQ Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQPageSchema) }} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              <button 
                onClick={() => toggleCategory(categoryIndex)}
                className={`w-full flex items-center justify-between p-5 text-left transition-all duration-300 bg-gradient-to-r ${category.color} text-white`}
              >
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{category.title}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${openCategory === categoryIndex ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openCategory === categoryIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-gray-100">
                      {category.questions.map((questionIndex) => (
                        <div key={questionIndex} className="border-t border-gray-100 first:border-t-0">
                          <button
                            onClick={() => toggleQuestion(questionIndex)}
                            className="flex justify-between items-center w-full p-5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="font-medium text-gray-900 pr-4">
                              {FAQPageSchema.mainEntity[questionIndex].name}
                            </h3>
                            <ChevronDown 
                              className={`flex-shrink-0 w-5 h-5 text-purple-500 transition-transform duration-300 ${openQuestions.includes(questionIndex) ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {openQuestions.includes(questionIndex) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-5 text-gray-600 bg-gray-50">
                                  <p>{FAQPageSchema.mainEntity[questionIndex].acceptedAnswer.text}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Please contact our support team.</p>
            <motion.a
             
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Contact Support
            </motion.a>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 py-12 mt-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-2">© {new Date().getFullYear()} ImageToCode by CodeNovaTech. All rights reserved.</p>
          <p className="text-sm text-gray-400">The #1 AI Design to Code Generator Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;
