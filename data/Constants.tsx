import dedent from "dedent";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
 
} from "react-icons/si";

import { Move, Palette, Layers, Smartphone } from "lucide-react";
export default {
  IMAGE_TO_NEXTJS_PROMPT: dedent`
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
  CODE_OPTIMIZER_PROMPT: `  
Comprehensive Code Enhancement Guidelines

1. Input Requirements
- Accept: Existing React code
- Process: Analyze → Debug → Enhance → Output
- Output: Production-ready optimized code

2. Code Analysis Phase
Technical Audit Checklist:
✅ Identify syntax errors
✅ Detect anti-patterns
✅ Find performance bottlenecks
✅ Check accessibility issues
✅ Verify responsive implementation
✅ Review state management
✅ Validate TypeScript types
✅ Check image optimization
✅ Verify security practices
✅ Review component structure

3. Bug Fixing Protocol
Critical Fixes:
1. Resolve runtime errors
2. Fix broken JSX syntax
3. Correct hook misuse
4. Repair broken imports
5. Fix prop type mismatches
6. Resolve key errors
7. Fix event handling issues
8. Correct lifecycle issues
9. Repair CSS specificity conflicts
10. Fix responsive breakpoints


4. Code Quality Standards
Style Requirements:
- Prettier formatting
- ESLint compliance
- Atomic design pattern
- DRY principle
- SOLID principles
- FSD architecture (if applicable)

5. Output Specifications
Format Requirements:
- Only return revised code
- No markdown formatting
- No explanations
- Complete working code

6. Extra More Attractive More ColorfullMore proffesinal More graphics Add

Example Output Structure:
//   ### Example of High-Quality Output:

  //   const App = () => {
  //   // Code here
  //   export default App;

  //   };

IMPORTANT SYNTAX CHECKS:
1. Verify all JSX elements are properly closed
2. Ensure correct quote pairing in strings
3. Validate all hooks dependencies arrays
4. Check prop type consistency
5. Verify Tailwind class ordering
6. Confirm proper TypeScript generics
7. Validate image import paths
8. Ensure proper async/await handling
9. Check for missing useEffect cleanups
10. Verify responsive breakpoint order (mobile-first)
`,
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

