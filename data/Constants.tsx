import dedent from "dedent";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiVuedotjs,
  SiDart,
  SiFlutter,
  SiSpringboot,
  SiDotnet,
  SiApple,
  SiSwift,
  SiKotlin,
  SiSpring,
  SiRust,
  SiGo,
  SiGoland,
  SiVuetify,
  SiRubyonrails,
  SiRuby,
  SiPhp,
  SiLaravel,
  SiPython,
  SiDjango,
  SiNodedotjs,
  SiFigma,
  SiAdobexd,
  // SiAmazonaws,
  SiGooglecloud,
  // SiMicrosoftazure,
  SiFirebase,
} from "react-icons/si";

import { Move, Palette, Layout, Zap, Layers, Smartphone } from "lucide-react";
export default {
  PROMPTFORNEXTJS: dedent`
    You are an expert frontend React developer and UI/UX designer with years of production experience. Your task is to generate a fully functional, error-free React component using Tailwind CSS based on the provided wireframe image or description. Follow these instructions meticulously:

    ### Instructions:
    1. **Analyze and Plan Thoroughly**:
       - Study the wireframe or description in detail, identifying all UI elements and their relationships.
       - Break down the UI into logical components (Header, Navigation, Content Sections, Footer, etc.).
       - Plan the component hierarchy, state management, and user interactions.
       - Consider the user flow and experience throughout the interface.

    2. **Code Requirements**:
       - Create a React component with proper default export that can run independently.
       - Structure code with multiple smaller components for maintainability, all integrated into one main component.
       - Use JavaScript (.js) with modern ES6+ syntax for the React component.
       - Implement Tailwind CSS for styling with standard utility classes (avoid arbitrary values like \`h-[600px]\`).
       - Use consistent spacing with Tailwind's spacing scale (m-4, p-6, gap-2, etc.) for professional layout.
       - Implement proper state management with React hooks (useState, useEffect, useCallback, useMemo).
       - Ensure all interactive elements have proper event handlers and state updates.

    3. **UI/UX Design Excellence**:
       - Precisely match the wireframe or description, including all specified sections and elements.
       - Use exact text content from the description where provided.
       - Implement a cohesive color scheme using Tailwind's color palette (blue-500, gray-800, etc.).
       - Create fully responsive layouts that work on mobile (320px), tablet (768px), and desktop (1280px+).
       - Use this image placeholder for all images: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'.
       - Import and use Lucide React icons (e.g., \`import { Home, Settings, User } from 'lucide-react';\`).
       - Add subtle animations and transitions for interactive elements (hover, focus, active states).

    4. **Code Quality and Error Prevention**:
       - Write complete, production-ready code with no placeholders or TODOs.
       - Include all repetitive elements as shown in the design (don't abbreviate with comments).
       - Implement comprehensive error handling for user inputs and async operations.
       - Add proper accessibility attributes (aria-label, role, tabIndex) and semantic HTML.
       - Ensure all JSX elements are properly closed and nested correctly.
       - Verify string literals are properly terminated and escaped where needed.
       - Double-check all className strings for proper syntax and closing quotes.
       - Ensure all React components are properly imported and exported.

    5. **Output Format Requirements**:
       - Return only the complete, executable React code starting with imports.
       - Include all necessary React imports at the top of the file.
       - Ensure the main component has a proper default export statement.
       - Format code with consistent indentation and spacing.
       - Do not include any explanatory text, comments, or markdown outside the code block.

    ## Expert Image-to-Code Generator Prompt
    You are an elite full-stack developer with exceptional expertise in translating visual designs (wireframes, mockups, UI screenshots) and text descriptions into production-ready code. Your primary focus is creating pixel-perfect, responsive, and accessible implementations with a strong emphasis on best practices and clean architecture.
    
    ### Upload Handling Instructions
    For Image Uploads:
    1. **Initial Analysis:**
       * Confirm receipt of the uploaded image
       * Verify image quality and visibility
       * If the image is unclear, request a better quality upload
    2. **Error Handling:**
       * If an upload fails or shows errors, provide clear instructions for alternative methods
       * If an incorrect image is uploaded (non-UI/UX related), politely ask for the correct image
       * If image content is unclear, request clarification on specific areas
    3. **Processing Confirmation:**
       * Acknowledge successful uploads with "✅ Image received and processing"
       * Describe what you can see in the image to confirm understanding
    
    For Text Descriptions:
    * Acknowledge the description and confirm understanding
    * Ask clarifying questions for ambiguous requirements
    * Request additional details for complex elements
    
    ### Analysis Framework
    For each design input, analyze and document:
    1. **Visual Hierarchy and Structure:**
       * Layout patterns (Grid, Flexbox, etc.)
       * Component organization and nesting
       * Responsive breakpoints and behavior
    2. **UI Elements Identification:**
       * Navigation systems and menus
       * Form elements and input patterns
       * Cards, containers, and content blocks
       * Media elements (images, videos, etc.)
       * Interactive components (buttons, toggles, etc.)
    3. **Style Analysis:**
       * Color scheme and application
       * Typography and text styling
       * Spacing and alignment patterns
       * Shadows, borders, and visual effects
    4. **Interaction and State Management:**
       * Hover, focus, and active states
       * Animations and transitions
       * Form validation patterns
       * Loading states and error handling
    5. **Accessibility Considerations:**
       * Color contrast compliance
       * Keyboard navigation support
       * Screen reader compatibility
       * Focus management requirements
    
    ### Implementation Requirements
    Code Quality Standards:
    * **Architecture:** Component-based, modular structure with proper separation of concerns
    * **Maintainability:** Descriptive naming, consistent formatting, appropriate comments
    * **Performance:** Optimized rendering, efficient DOM updates, proper asset handling
    * **Accessibility:** WCAG 2.1 AA compliance with semantic HTML and proper ARIA attributes
    
    Technical Specifications:
    * **React/Next.js/React Native/HTML&CSS/Vue/Angular/Node.js/TypeScript:** Modern functional components with proper hooks usage
    * **State Management:** Context API or Redux for complex state
    * **Styling:** Tailwind CSS with responsive design principles
    * **Form Handling:** React Hook Form or Formik with Yup validation
    * **Animation:** Framer Motion or CSS transitions/animations
    * **API Integration:** Axios or Fetch with proper error handling
    
    Output Format:
    1. Complete working code with no placeholders
    2. Properly organized file structure
    3. All necessary imports and dependencies
    4. Responsive implementations for mobile, tablet, and desktop
    5. Interactive elements with proper state management
    6. Accessible markup with appropriate ARIA attributes
    7. Well-documented props and component interfaces

    ### Example of High-Quality Output:
    
    
    const App = () => {
    // Code here
    export default App;
    
  `,
  ERROR_PREVENTION_PROMPTFORNEXTJS: `
IMPORTANT: Your generated code must be free of syntax errors. Pay special attention to:
1. All string literals must be properly terminated with matching quotes
2. All JSX elements must be properly closed
3. All curly braces, parentheses, and brackets must be properly balanced
4. All className attributes must have properly formatted values
5. All React components must have proper import and export statements
6. Ensure all variable names are properly defined before use
7. Double-check all template literals for proper syntax
8. Return ONLY the code, not explanations or markdown formatting
`,
  CREDIT_COSTS: {
    NORMAL_MODE: 10,
    EXPERT_MODE: 40,
    PRICING_PLANS: [
      { price: 20, credits: 10 },
      { price: 50, credits: 30, originalPrice: 60 },
      { price: 140, credits: 90, originalPrice: 180 },
      { price: 400, credits: 250, originalPrice: 500 },
    ],
  },
};
export const languages = [
  // Frontend frameworks
  {
    id: "react-tailwind",
    name: "React + Tailwind",
    icon: <SiReact className="text-4xl text-[#61DAFB]" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Modern, responsive components with utility-first CSS",
    gradient: "from-[#61DAFB]/10 to-[#06B6D4]/10",
    hoverGradient: "from-[#61DAFB]/20 to-[#06B6D4]/20",
    bgColor: "bg-[#61DAFB]/5",
    category: "frontend",
    popularity: 96,
  },
  {
    id: "nextjs-tailwind",
    name: "Next.js + Tailwind",
    icon: <SiNextdotjs className="text-4xl text-black dark:text-white" />,
    secondaryIcon: <SiTailwindcss className="text-4xl text-[#06B6D4]" />,
    description: "Full-stack React framework with optimized styling",
    gradient: "from-black/10 to-[#06B6D4]/10",
    hoverGradient: "from-black/20 to-[#06B6D4]/20",
    bgColor: "bg-black/5 dark:bg-white/5",
    category: "frontend",
    popularity: 92,
  },
  {
    id: "html-css",
    name: "HTML & CSS",
    icon: <SiHtml5 className="text-4xl text-[#E34F26]" />,
    secondaryIcon: <SiCss3 className="text-4xl text-[#1572B6]" />,
    description: "Clean, semantic markup with modern CSS",
    gradient: "from-[#E34F26]/10 to-[#1572B6]/10",
    hoverGradient: "from-[#E34F26]/20 to-[#1572B6]/20",
    bgColor: "bg-[#E34F26]/5",
    category: "frontend",
    popularity: 98,
  },
  // Additional languages below
  {
    id: "typescript-react",
    name: "TypeScript + React",
    icon: <SiTypescript className="text-4xl text-[#3178C6]" />,
    secondaryIcon: <SiReact className="text-4xl text-[#61DAFB]" />,
    description: "Type-safe development with React component architecture",
    gradient: "from-[#3178C6]/10 to-[#61DAFB]/10",
    hoverGradient: "from-[#3178C6]/20 to-[#61DAFB]/20",
    bgColor: "bg-[#3178C6]/5",
    category: "frontend",
    popularity: 90,
  },
  //   {
  //     id: "javascript-node",
  //     name: "JavaScript + Node.js",
  //     icon: <SiJavascript className="text-4xl text-[#F7DF1E]" />,
  //     secondaryIcon: <SiNodedotjs className="text-4xl text-[#339933]" />,
  //     description: "Full-stack JavaScript development with server-side runtime",
  //     gradient: "from-[#F7DF1E]/10 to-[#339933]/10",
  //     hoverGradient: "from-[#F7DF1E]/20 to-[#339933]/20",
  //     bgColor: "bg-[#F7DF1E]/5",
  //     category: "fullstack",
  //     popularity: 94,
  //   },
  //   {
  //     id: "python-django",
  //     name: "Python + Django",
  //     icon: <SiPython className="text-4xl text-[#3776AB]" />,
  //     secondaryIcon: <SiDjango className="text-4xl text-[#092E20]" />,
  //     description: "Robust back-end development with Python's popular framework",
  //     gradient: "from-[#3776AB]/10 to-[#092E20]/10",
  //     hoverGradient: "from-[#3776AB]/20 to-[#092E20]/20",
  //     bgColor: "bg-[#3776AB]/5",
  //     category: "backend",
  //     popularity: 86,
  //   },
  //   {
  //     id: "php-laravel",
  //     name: "PHP + Laravel",
  //     icon: <SiPhp className="text-4xl text-[#777BB4]" />,
  //     secondaryIcon: <SiLaravel className="text-4xl text-[#FF2D20]" />,
  //     description: "Elegant syntax and tools for web artisans",
  //     gradient: "from-[#777BB4]/10 to-[#FF2D20]/10",
  //     hoverGradient: "from-[#777BB4]/20 to-[#FF2D20]/20",
  //     bgColor: "bg-[#777BB4]/5",
  //     category: "backend",
  //     popularity: 78,
  //   },
  //   {
  //     id: "ruby-rails",
  //     name: "Ruby + Rails",
  //     icon: <SiRuby className="text-4xl text-[#CC342D]" />,
  //     secondaryIcon: <SiRubyonrails className="text-4xl text-[#CC0000]" />,
  //     description: "Convention over configuration for rapid development",
  //     gradient: "from-[#CC342D]/10 to-[#CC0000]/10",
  //     hoverGradient: "from-[#CC342D]/20 to-[#CC0000]/20",
  //     bgColor: "bg-[#CC342D]/5",
  //     category: "backend",
  //     popularity: 72,
  //   },
  //   {
  //     id: "vue-vuetify",
  //     name: "Vue.js + Vuetify",
  //     icon: <SiVuedotjs className="text-4xl text-[#4FC08D]" />,
  //     secondaryIcon: <SiVuetify className="text-4xl text-[#1867C0]" />,
  //     description: "Progressive framework with Material Design components",
  //     gradient: "from-[#4FC08D]/10 to-[#1867C0]/10",
  //     hoverGradient: "from-[#4FC08D]/20 to-[#1867C0]/20",
  //     bgColor: "bg-[#4FC08D]/5",
  //     category: "frontend",
  //     popularity: 82,
  //   },
  //   {
  //     id: "go-fiber",
  //     name: "Go + Fiber",
  //     icon: <SiGo className="text-4xl text-[#00ADD8]" />,
  //     secondaryIcon: <SiGoland className="text-4xl text-[#00ADD8]" />,
  //     description: "High-performance web framework inspired by Express",
  //     gradient: "from-[#00ADD8]/10 to-[#00ADD8]/10",
  //     hoverGradient: "from-[#00ADD8]/20 to-[#00ADD8]/20",
  //     bgColor: "bg-[#00ADD8]/5",
  //     category: "backend",
  //     popularity: 76,
  //   },
  //   {
  //     id: "rust-rocket",
  //     name: "Rust + Rocket",
  //     icon: <SiRust className="text-4xl text-[#000000]" />,
  //     secondaryIcon: <SiRust className="text-4xl text-[#B7410E]" />,
  //     description: "Safe, concurrent, practical language with web framework",
  //     gradient: "from-[#000000]/10 to-[#B7410E]/10",
  //     hoverGradient: "from-[#000000]/20 to-[#B7410E]/20",
  //     bgColor: "bg-black/5 dark:bg-white/5",
  //     category: "backend",
  //     popularity: 74,
  //   },
  //   {
  //     id: "kotlin-spring",
  //     name: "Kotlin + Spring",
  //     icon: <SiKotlin className="text-4xl text-[#7F52FF]" />,
  //     secondaryIcon: <SiSpring className="text-4xl text-[#6DB33F]" />,
  //     description: "Modern JVM language with powerful Spring ecosystem",
  //     gradient: "from-[#7F52FF]/10 to-[#6DB33F]/10",
  //     hoverGradient: "from-[#7F52FF]/20 to-[#6DB33F]/20",
  //     bgColor: "bg-[#7F52FF]/5",
  //     category: "backend",
  //     popularity: 80,
  //   },
  //   {
  //     id: "swift-swiftui",
  //     name: "Swift + SwiftUI",
  //     icon: <SiSwift className="text-4xl text-[#F05138]" />,
  //     secondaryIcon: <SiApple className="text-4xl text-[#000000]" />,
  //     description: "Native iOS development with declarative UI framework",
  //     gradient: "from-[#F05138]/10 to-[#000000]/10",
  //     hoverGradient: "from-[#F05138]/20 to-[#000000]/20",
  //     bgColor: "bg-[#F05138]/5",
  //     category: "mobile",
  //     popularity: 84,
  //   },
  //   {
  //     id: "java-spring",
  //     name: "Java + Spring Boot",
  //     icon: <SiJavascript className="text-4xl text-[#007396]" />,
  //     secondaryIcon: <SiSpringboot className="text-4xl text-[#6DB33F]" />,
  //     description: "Enterprise-grade development with Spring Boot simplicity",
  //     gradient: "from-[#007396]/10 to-[#6DB33F]/10",
  //     hoverGradient: "from-[#007396]/20 to-[#6DB33F]/20",
  //     bgColor: "bg-[#007396]/5",
  //     category: "backend",
  //     popularity: 85,
  //   },
  //   {
  //     id: "dart-flutter",
  //     name: "Dart + Flutter",
  //     icon: <SiDart className="text-4xl text-[#0175C2]" />,
  //     secondaryIcon: <SiFlutter className="text-4xl text-[#02569B]" />,
  //     description:
  //       "Google's UI toolkit for building natively compiled applications",
  //     gradient: "from-[#0175C2]/10 to-[#02569B]/10",
  //     hoverGradient: "from-[#0175C2]/20 to-[#02569B]/20",
  //     bgColor: "bg-[#0175C2]/5",
  //     category: "mobile",
  //     popularity: 88,
  //   },
  //   // New technologies
  //   {
  //     id: "figma-design",
  //     name: "Figma Design",
  //     icon: <SiFigma className="text-4xl text-[#F24E1E]" />,
  //     secondaryIcon: <SiAdobexd className="text-4xl text-[#FF61F6]" />,
  //     description:
  //       "Collaborative interface design tool for modern web and mobile apps",
  //     gradient: "from-[#F24E1E]/10 to-[#FF61F6]/10",
  //     hoverGradient: "from-[#F24E1E]/20 to-[#FF61F6]/20",
  //     bgColor: "bg-[#F24E1E]/5",
  //     category: "design",
  //     popularity: 92,
  //   },
  //   {
  //     id: "aws-cloud",
  //     name: "AWS Cloud",
  //     icon: <SiFirebase className="text-4xl text-[#FF9900]" />,
  //     secondaryIcon: <SiFirebase className="text-4xl text-[#FFCA28]" />,
  //     description: "Cloud infrastructure with serverless and managed services",
  //     gradient: "from-[#FF9900]/10 to-[#FFCA28]/10",
  //     hoverGradient: "from-[#FF9900]/20 to-[#FFCA28]/20",
  //     bgColor: "bg-[#FF9900]/5",
  //     category: "cloud",
  //     popularity: 94,
  //   },
  //   {
  //     id: "gcp-cloud",
  //     name: "Google Cloud",
  //     icon: <SiGooglecloud className="text-4xl text-[#4285F4]" />,
  //     secondaryIcon: <SiFirebase className="text-4xl text-[#FFCA28]" />,
  //     description:
  //       "Google's cloud platform with AI and machine learning capabilities",
  //     gradient: "from-[#4285F4]/10 to-[#FFCA28]/10",
  //     hoverGradient: "from-[#4285F4]/20 to-[#FFCA28]/20",
  //     bgColor: "bg-[#4285F4]/5",
  //     category: "cloud",
  //     popularity: 88,
  //   },
  //   {
  //     id: "azure-cloud",
  //     name: "Microsoft Azure",
  //     icon: <SiDotnet className="text-4xl text-[#0078D4]" />,
  //     secondaryIcon: <SiDotnet className="text-4xl text-[#512BD4]" />,
  //     description:
  //       "Microsoft's cloud with integrated services for .NET ecosystem",
  //     gradient: "from-[#0078D4]/10 to-[#512BD4]/10",
  //     hoverGradient: "from-[#0078D4]/20 to-[#512BD4]/20",
  //     bgColor: "bg-[#0078D4]/5",
  //     category: "cloud",
  //     popularity: 86,
  //   },
];
export const categories = [
  {
    id: "all",
    name: "All Technologies",
    color: "bg-gradient-to-r from-purple-600 to-indigo-600",
  },
  {
    id: "frontend",
    name: "Frontend",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    id: "backend",
    name: "Backend",
    color: "bg-gradient-to-r from-emerald-500 to-green-500",
  },
  {
    id: "fullstack",
    name: "Full Stack",
    color: "bg-gradient-to-r from-orange-500 to-amber-500",
  },
  {
    id: "mobile",
    name: "Mobile",
    color: "bg-gradient-to-r from-pink-500 to-rose-500",
  },
  {
    id: "cloud",
    name: "Cloud",
    color: "bg-gradient-to-r from-sky-500 to-blue-500",
  },
  {
    id: "design",
    name: "Design",
    color: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
  },
];
export const REACT_OPTIONS = [
  {
    name: "Animations",
    value: "animations",
    icon: <Move className="h-5 w-5" />,
    description: "Add smooth transitions and motion effects",
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-500 to-fuchsia-600",
    borderColor: "border-purple-200",
  },
  {
    name: "Colorful Design",
    value: "colorful",
    icon: <Palette className="h-5 w-5" />,
    description: "Use vibrant and modern color schemes",
    color: "bg-pink-100 text-pink-600",
    gradient: "from-pink-500 to-rose-600",
    borderColor: "border-pink-200",
  },
  {
    name: "Component Architecture",
    value: "components",
    icon: <Layers className="h-5 w-5" />,
    description: "Well-structured reusable component system",
    color: "bg-green-100 text-green-600",
    gradient: "from-green-500 to-emerald-600",
    borderColor: "border-green-200",
  },
  {
    name: "Mobile First",
    value: "mobile",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Prioritize mobile experience with adaptive design",
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-500 to-violet-600",
    borderColor: "border-indigo-200",
  },
  {
    name: "Responsive Layout",
    value: "responsive",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="6"
          y1="19"
          x2="18"
          y2="19"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    description: "Fully responsive design for all screen sizes",
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-200",
  },
  {
    name: "Dark Mode",
    value: "darkmode",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "Optional dark theme support",
    color: "bg-gray-100 text-gray-600",
    gradient: "from-gray-700 to-gray-900",
    borderColor: "border-gray-200",
  },
  {
    name: "Interactive UI",
    value: "interactive",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 12H8.01M12 12H12.01M16 12H16.01M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "Highly interactive UI elements",
    color: "bg-amber-100 text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    borderColor: "border-amber-200",
  },
  {
    name: "Performance Optimized",
    value: "performance",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "Optimized for fast loading and rendering",
    color: "bg-green-100 text-green-600",
    gradient: "from-green-500 to-emerald-600",
    borderColor: "border-green-200",
  },
  {
    name: "Accessibility",
    value: "a11y",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 9V15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "WCAG compliant design and interactions",
    color: "bg-teal-100 text-teal-600",
    gradient: "from-teal-500 to-emerald-600",
    borderColor: "border-teal-200",
  },
  {
    name: "Internationalization",
    value: "i18n",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "Multi-language support and RTL compatibility",
    color: "bg-cyan-100 text-cyan-600",
    gradient: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-200",
  },
  {
    name: "State Management",
    value: "state",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    description: "Efficient state handling with React hooks or Redux",
    color: "bg-red-100 text-red-600",
    gradient: "from-red-500 to-rose-600",
    borderColor: "border-red-200",
  },
  {
    name: "Micro-interactions",
    value: "microinteractions",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 5V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 21V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 12H3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 12H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    description: "Subtle feedback animations for user interactions",
    color: "bg-violet-100 text-violet-600",
    gradient: "from-violet-500 to-purple-600",
    borderColor: "border-violet-200",
  },
  {
    name: "Server Components",
    value: "server",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="2"
          y="14"
          width="20"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="6"
          y1="6"
          x2="6.01"
          y2="6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="18"
          x2="6.01"
          y2="18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    description: "Leverage React Server Components for optimal rendering",
    color: "bg-orange-100 text-orange-600",
    gradient: "from-orange-500 to-amber-600",
    borderColor: "border-orange-200",
  },
];
