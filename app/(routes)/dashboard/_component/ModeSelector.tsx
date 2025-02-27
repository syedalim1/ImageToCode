"use client";

interface ModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  preview: string | null;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  setSelectedMode,
  preview,
}) => {
  return (
    <div className="">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Select Mode
        </h2>
        <p className="text-gray-500 mb-4">
          Choose the mode for code generation
        </p>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              id="normal"
              value="normal"
              checked={selectedMode === "normal"}
              onChange={() => setSelectedMode("normal")}
              className="h-5 w-5 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="normal">Normal Mode (10 Credits)</label>
          </label>
          <label className="flex items-center gap-2 ">
            <input
              type="radio"
              id="export"
              value="export"
              checked={selectedMode === "export"}
              onChange={() => setSelectedMode("export")}
              className="h-5 w-5 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="export">Export Mode (30 Credits)</label>
          </label>
        </div>
      </div>

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

export default ModeSelector;
