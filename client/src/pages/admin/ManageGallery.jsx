import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import ConfirmModal from '../../components/common/ConfirmModal';
import { galleryAPI, uploadAPI } from '../../utils/api';
import { toast } from 'sonner';
import config from '../../config/env';

const ManageGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    eventDate: '',
    images: [],
    youtubeLinks: []
  });

  const fetchGalleries = useCallback(async () => {
    try {
      const response = await galleryAPI.getAllAdmin();
      setGalleries(response.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      if (editingId) {
        await galleryAPI.update(editingId, formData);
        toast.success('Gallery updated successfully!');
      } else {
        await galleryAPI.create(formData);
        toast.success('Gallery created successfully!');
      }
      resetForm();
      fetchGalleries();
    } catch (error) {
      console.error('Error saving gallery:', error);
      toast.error('Failed to save gallery');
    }
  };

  const handleEdit = (gallery) => {
    setFormData({
      title: gallery.title,
      eventDate: gallery.eventDate ? gallery.eventDate.split('T')[0] : '',
      images: gallery.images || [],
      youtubeLinks: gallery.youtubeLinks || []
    });
    setEditingId(gallery._id);
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setGalleryToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await galleryAPI.delete(galleryToDelete);
      toast.success('Gallery deleted successfully!');
      fetchGalleries();
      setShowConfirmModal(false);
      setGalleryToDelete(null);
    } catch (error) {
      console.error('Error deleting gallery:', error);
      toast.error('Failed to delete gallery');
      setShowConfirmModal(false);
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadingImages(true);
      try {
        const response = await uploadAPI.multiple(files);
        const newImages = response.data.urls.map(url => ({ url }));
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages]
        });
        toast.success(`${files.length} image(s) uploaded successfully!`);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images');
      } finally {
        setUploadingImages(false);
      }
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addYoutubeLink = () => {
    setFormData({
      ...formData,
      youtubeLinks: [...formData.youtubeLinks, { url: '', title: '' }]
    });
  };

  const updateYoutubeLink = (index, field, value) => {
    const newLinks = [...formData.youtubeLinks];
    newLinks[index][field] = value;
    setFormData({ ...formData, youtubeLinks: newLinks });
  };

  const removeYoutubeLink = (index) => {
    const newLinks = formData.youtubeLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, youtubeLinks: newLinks });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      eventDate: '',
      images: [],
      youtubeLinks: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Gallery</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
          >
            {showForm ? 'Cancel' : 'Add New Gallery'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Gallery' : 'Create New Gallery'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Kannada Rajyothsava 2024"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Format: Event Name - Year</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images * (Upload multiple images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled={uploadingImages}
                />
                {uploadingImages && (
                  <p className="text-sm text-blue-600 mt-2">Uploading images...</p>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${config.baseUrl}${image.url}`}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {formData.images.length} image(s) uploaded
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    YouTube Video Links (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addYoutubeLink}
                    className="text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    + Add Video Link
                  </button>
                </div>
                {formData.youtubeLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateYoutubeLink(index, 'title', e.target.value)}
                      placeholder="Video Title"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateYoutubeLink(index, 'url', e.target.value)}
                      placeholder="YouTube URL"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeYoutubeLink(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
                  disabled={uploadingImages}
                >
                  {editingId ? 'Update' : 'Create'} Gallery
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {gallery.images && gallery.images.length > 0 && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={`${config.baseUrl}${gallery.images[0].url}`}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {gallery.images.length} photos
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{gallery.title}</h3>
                  {gallery.eventDate && (
                    <p className="text-gray-500 text-sm mb-2">
                      {new Date(gallery.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {gallery.youtubeLinks && gallery.youtubeLinks.length > 0 && (
                    <p className="text-blue-600 text-sm mb-4">
                      {gallery.youtubeLinks.length} video(s)
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(gallery)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(gallery._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Gallery"
          message="Are you sure you want to delete this gallery? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default ManageGallery;
