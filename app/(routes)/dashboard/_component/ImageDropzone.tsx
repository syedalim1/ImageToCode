"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, X, CheckCircle } from "lucide-react";

interface ImageDropzoneProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setShowSuccessIndicator: (show: boolean) => void;
  setActiveTab: (tab: "upload" | "options" | "description") => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  selectedFile,
  setSelectedFile,
  preview,
  setPreview,
  error,
  setError,
  setShowSuccessIndicator,
  setActiveTab,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large");
        return;
      }

      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setShowSuccessIndicator(true);
        setTimeout(() => setShowSuccessIndicator(false), 2000);
        setTimeout(() => setActiveTab("options"), 1000);
      };
      reader.readAsDataURL(file);
    }
  }, [setSelectedFile, setPreview, setError, setShowSuccessIndicator, setActiveTab]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="h-full">
      <div
        {...getRootProps()}
        className={`w-full h-full flex flex-col items-center justify-center cursor-pointer 
          ${isDragActive ? "bg-blue-50 border-blue-500" : ""}
          ${error ? "border-red-500 bg-red-50" : ""}`}
      >
        <input {...getInputProps()} id="imageselect" />

        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 object-contain rounded-md mb-4 shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            
            {/* Success indicator */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Image Ready!</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <CloudUpload className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="font-bold text-xl mb-2">
              {isDragActive ? "Drop image here" : "Upload Image"}
            </h2>
            <p className="text-gray-500 text-center max-w-xs mb-4">
              Drag and drop your design image, or click to browse your files
            </p>
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg text-sm text-gray-500">
              Supports PNG, JPG, JPEG up to 5MB
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start">
          <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
