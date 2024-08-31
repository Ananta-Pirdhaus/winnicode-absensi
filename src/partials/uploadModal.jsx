import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { axiosInstance } from "../components/axios";

const MySwal = withReactContent(Swal);

const UploadModal = ({ isOpen, onClose, student, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("url", file);

      setIsUploading(true);
      setError(null);

      try {
        const response = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setIsUploading(false);

        if (response.status === 200) {
          setFileUrl(response.data.url);
          MySwal.fire({
            title: "Upload Successful",
            text: `Image URL: ${response.data.url}`,
            icon: "success",
          });

          // Notify parent about the successful upload
          onUploadSuccess(response.data.url);
        } else {
          throw new Error("Upload failed");
        }
      } catch (err) {
        setIsUploading(false);
        setError(err.message);

        console.error(
          "Upload Error:",
          err.response ? err.response.data : err.message
        );

        MySwal.fire({
          title: "Upload Failed",
          text: err.message || "Something went wrong during the upload.",
          icon: "error",
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Upload Image
        </h3>
        {student && (
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Nama: {student.name}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Jurusan: {student.jurusan?.nama || "N/A"}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Kelas: {student.kelas?.nama || "N/A"}
            </p>
          </div>
        )}
        {fileUrl && (
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              File URL:
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {fileUrl}
            </a>
          </div>
        )}
        <div className="flex items-center justify-center w-full mb-6">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-blue-500 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-gray-700 dark:border-blue-600 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="w-12 h-12 mb-4 text-blue-500 dark:text-blue-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 16v-4m0 0L8 12m4-4l4 4M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Click or Drag</span> to upload
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supported formats: SVG, PNG, JPG, GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Close"}
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
