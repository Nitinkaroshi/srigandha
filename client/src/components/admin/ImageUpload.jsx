import { useState, useId } from 'react';
import { uploadAPI } from '../../utils/api';
import { toast } from 'sonner';

const ImageUpload = ({ onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const inputId = useId();

  const handleFileChange = async (e) => {
    const files = multiple ? Array.from(e.target.files) : [e.target.files[0]];

    if (files.length === 0) return;

    setUploading(true);

    try {
      let response;
      if (multiple) {
        response = await uploadAPI.multiple(files);
        onUploadSuccess(response.data.urls);
      } else {
        response = await uploadAPI.single(files[0]);
        onUploadSuccess(response.data.url);
      }
      toast.success('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
        disabled={uploading}
      />
      <label
        htmlFor={inputId}
        className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition"
      >
        {uploading ? 'Uploading...' : multiple ? 'Choose Images' : 'Choose Image'}
      </label>
      <p className="text-gray-500 text-sm mt-2">
        {multiple ? 'Select multiple images (max 5MB each)' : 'Select an image (max 5MB)'}
      </p>
    </div>
  );
};

export default ImageUpload;
