"use client";

interface DescriptionInputProps {
  userDescription: string;
  setUserDescription: (description: string) => void;
  isUploading: boolean;
  preview: string | null;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  userDescription,
  setUserDescription,
  isUploading,
  preview,
}) => {
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-2 text-gray-800">
        Describe Your Design
      </h2>
      <p className="text-gray-500 mb-4">
        Add details to help the AI understand your design better
      </p>

      <textarea
        value={userDescription}
        onChange={(e) => setUserDescription(e.target.value)}
        placeholder="Describe what you want to generate... (e.g., 'A responsive landing page with a hero section, features grid, and contact form')"
        className="w-full h-40 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner"
        disabled={isUploading}
      />

      {preview && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Selected Image:</p>
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionInput;
