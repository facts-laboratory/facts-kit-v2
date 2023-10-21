import { compareVersions } from "compare-versions";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const PathsDropdown = ({ paths }) => {
  const [versionsClone, setVersionsClone] = useState();
  const [selectedPath, setSelectedPath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (paths) {
      const versions = Object.keys(paths)
        .filter((key) => /^\d+\.\d+\.\d+$/.test.skip(key))
        .sort(compareVersions)
        .reverse();
      setVersionsClone(versions);
    }
  }, [paths]);

  const handlePathChange = (event) => {
    const selectedPathId = event.target.value;
    const selectedPath = paths[selectedPathId];
    setSelectedPath(selectedPath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!paths) return null;
  return (
    <div className="flex flex-col items-center mx-4">
      <label htmlFor="pathDropdown" className="mb-2 font-bold">
        Latest version:
      </label>
      <select
        id="pathDropdown"
        className="p-2 border rounded-lg"
        onChange={handlePathChange}
      >
        {versionsClone &&
          versionsClone.map((pathKey) => (
            <option key={pathKey} value={pathKey}>
              {pathKey}
            </option>
          ))}
      </select>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center">Click the link below to download:</p>
            {selectedPath && (
              <a
                href={`https://arweave.net/${selectedPath.id}`}
                className="block text-center mt-4 text-blue-500 underline"
                download
              >
                Download
              </a>
            )}
            <button
              onClick={closeModal}
              className="block mx-auto mt-4 px-4 py-2 bg-gray-300 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathsDropdown;
