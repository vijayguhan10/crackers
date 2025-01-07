import React, { useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";

const Photos = () => {
  const [headerPhotos, setHeaderPhotos] = useState([]);
  const [footerPhotos, setFooterPhotos] = useState([]);

  // Upload handler
  const handleUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "header" && headerPhotos.length < 4) {
          setHeaderPhotos([...headerPhotos, reader.result]);
        } else if (type === "footer" && footerPhotos.length < 4) {
          setFooterPhotos([...footerPhotos, reader.result]);
        } else {
          alert("Maximum of 4 photos allowed.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete handler
  const handleDelete = (type, index) => {
    if (type === "header") {
      setHeaderPhotos(headerPhotos.filter((_, i) => i !== index));
    } else if (type === "footer") {
      setFooterPhotos(footerPhotos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className=" bg-white p-10">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Manage Photos
      </h1>

      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Header Photos
        </h2>
        <div className="flex items-center space-x-4">
          {headerPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Header Photo ${index + 1}`}
                className="w-32 h-32 rounded-lg shadow-lg"
              />
              <button
                onClick={() => handleDelete("header", index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {headerPhotos.length < 4 && (
            <label className="flex items-center justify-center w-32 h-32 bg-blue-100 rounded-lg border border-dashed border-blue-400 cursor-pointer hover:bg-blue-200 shadow">
              <PlusCircle size={24} className="text-blue-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload("header", e)}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Footer Photos
        </h2>
        <div className="flex items-center space-x-4">
          {footerPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Footer Photo ${index + 1}`}
                className="w-32 h-32 rounded-lg shadow-lg"
              />
              <button
                onClick={() => handleDelete("footer", index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {footerPhotos.length < 4 && (
            <label className="flex items-center justify-center w-32 h-32 bg-blue-100 rounded-lg border border-dashed border-blue-400 cursor-pointer hover:bg-blue-200 shadow">
              <PlusCircle size={24} className="text-blue-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload("footer", e)}
              />
            </label>
          )}
        </div>
      </div>
      <button className="bg-[#6be196] text-black px-4 py-2 mt-10 rounded-lg hover:bg-[#4ADE80]">
        Submit Photos
      </button>
      <div className="border border-black mt-20"></div>
    </div>
  );
};

export default Photos;
