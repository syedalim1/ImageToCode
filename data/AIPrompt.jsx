import dedent from "dedent";

export default {


  CODE_GEN_PROMPT_REACT_TAILWIND: dedent`
    Generate a programming code structure for a React project using Vite. 
    Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed.

    The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, 
    except for icons from the lucide-react library, which should only be used when necessary. 

    Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, 
    Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight.

    For example, you can import an icon as:
    import { Heart } from "lucide-react" 
    and use it in JSX as <Heart className="" />

    ✅ **Important**: Ensure the main file is always created as **/App.js** only. 
    🔁 Do **not** place App.js in any other location.

    Use the following output format:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/App.js": {
          "code": ""
        },
        ...
      },
      
    }

    - You can use date-fns for date formatting
    - You can use react-chartjs-2 for charts or graphs
    - For placeholder images, use: https://archive.org/download/placeholder-image/placeholder-image.jpg
    - Add emojis where helpful for better UX 😄
    - Designs must be beautiful, not generic – production-worthy!
    - JSX syntax + Tailwind CSS + React hooks are default
    - Use Unsplash for stock photos (valid URLs only)
  `,
  CODE_GEN_PROMPT_FORHTML_CSS: dedent`
        🏗️ HTML STRUCTURE REQUIREMENTS:
    ➤ Use semantic HTML5 elements precisely (header, nav, main, section, article, aside, footer)
    ➤ Implement proper HTML attributes for accessibility (aria-labels, role, alt text)
    ➤ Use correct meta tags for SEO and responsive design
    ➤ Structure content with proper heading hierarchy (h1-h6)
    ➤ Implement forms with proper validation attributes and labels
    ➤ Add descriptive class names that reflect component purpose
    ➤ Include well-placed, helpful comments for major sections

    🎨 CSS IMPLEMENTATION REQUIREMENTS:
    ➤ Create well-structured, production-quality CSS using modern techniques
    ➤ Implement layouts using Flexbox and CSS Grid appropriately
    ➤ Use CSS custom properties (variables) for colors and reusable values
    ➤ Implement precise color matching with exact hex/RGB values
    ➤ Create exact shadows, gradients, and effects as specified
    ➤ Use proper CSS specificity to avoid selector conflicts
    ➤ Implement BEM or similar methodology for class naming
    ➤ Include detailed comments for complex CSS rules
    ➤ Avoid !important unless absolutely necessary

    
    ✅ REQUIRED OUTPUT STRUCTURE:
    ➤ Main file MUST be created at **/index.html** only
    ➤ CSS file should be at **/style.css**
    ➤ Additional CSS files only if logically needed
    ➤ JavaScript should be in separate .js files

    Use this exact output format:
    {
      "projectTitle": "",
      "explanation": "",
      "files": {
        "/index.html": {
          "code": ""
        },
        "/style.css": {
          "code": ""
        },
        ...
      },
     
    }

    RESOURCES TO USE:
    🖼️ Placeholder images: "https://source.unsplash.com/random/[WIDTHxHEIGHT]?[keyword]"
    🔤 For custom fonts: Google Fonts via CDN (include specific font weights needed)
    🎭 Icons: Use SVG icons inline for better performance
    😄 Include appropriate emojis for better user experience

    IMPORTANT: Create visually stunning, production-quality code with precise styling, accurate layouts, and error-free implementation. The code must render exactly as intended across all modern browsers.
 
  `,
};
