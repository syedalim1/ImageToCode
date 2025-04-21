import { ProjectTitleContext } from "@/app/context/ProjectTitleContext";

import React, { useContext } from "react";

function ProjectTitle() {
  const { projectTitle, setProjectTitle } = useContext(ProjectTitleContext);

  // console.log(projectTitle, " projectTitle");

  return (
    <div>
      <div className="relative">
        <textarea
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
          className={`w-full h-48 p-5 border-2 border-indigo-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-inner text-gray-700 transition-all duration-300 ${
             ""
          }`}
        />
      </div>
    </div>
  );
}

export default ProjectTitle;
