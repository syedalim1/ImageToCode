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
      "generatedFiles": []
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
    Generate a beautiful and clean HTML + CSS project.

    ➤ Organize the code using semantic HTML5 elements
    ➤ Use well-structured, production-quality CSS (preferably with Flexbox or Grid)
    ➤ Do NOT use any external frameworks like Bootstrap, Tailwind, etc.
    ➤ Make sure the design is fully responsive and user-friendly
    ➤ Use emojis where needed for a better experience 😄
    ➤ Add comments inside the HTML and CSS to describe major sections
    ➤ Use placeholder images from:
       https://archive.org/download/placeholder-image/placeholder-image.jpg

    ✅ **Important**: The main file must be created at **/index.html** only.
    🔁 Do NOT place the HTML file in any subfolder. It must be exactly **/index.html**

    Use this output format:
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
      "generatedFiles": []
    }

    💡 Make it visually appealing — no boring or default styles!
    🎨 Use Google Fonts via CDN only if needed
    📸 Use Unsplash URLs for any background or content images
  `,
};
