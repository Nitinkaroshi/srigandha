import { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import ConfirmModal from '../../components/common/ConfirmModal';
import { pagesAPI } from '../../utils/api';
import { toast } from 'sonner';
import config from '../../config/env';

const ManagePages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    sections: [],
    metaDescription: '',
    isPublished: true
  });
  const [currentSection, setCurrentSection] = useState({
    type: 'text',
    order: 0,
    content: {}
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.getAll();
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await pagesAPI.update(editingPage._id, formData);
        toast.success('Page updated successfully!');
      } else {
        await pagesAPI.create(formData);
        toast.success('Page created successfully!');
      }
      fetchPages();
      closeModal();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    }
  };

  const handleDeleteClick = (id) => {
    setPageToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await pagesAPI.delete(pageToDelete);
      toast.success('Page deleted successfully!');
      fetchPages();
      setShowConfirmModal(false);
      setPageToDelete(null);
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
      setShowConfirmModal(false);
    }
  };

  const openModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        slug: page.slug,
        title: page.title,
        sections: page.sections || [],
        metaDescription: page.metaDescription || '',
        isPublished: page.isPublished
      });
    } else {
      setEditingPage(null);
      setFormData({
        slug: '',
        title: '',
        sections: [],
        metaDescription: '',
        isPublished: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPage(null);
    setCurrentSection({ type: 'text', order: 0, content: {} });
  };

  const addSection = () => {
    const newSection = {
      ...currentSection,
      order: formData.sections.length
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection]
    });
    setCurrentSection({ type: 'text', order: 0, content: {} });
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    newSections.forEach((section, i) => section.order = i);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSectionDown = (index) => {
    if (index === formData.sections.length - 1) return;
    const newSections = [...formData.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    newSections.forEach((section, i) => section.order = i);
    setFormData({ ...formData, sections: newSections });
  };

  const renderSectionPreview = (section, index) => {
    return (
      <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-700">Section {index + 1}:</span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{section.type}</span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => moveSectionUp(index)}
              disabled={index === 0}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveSectionDown(index)}
              disabled={index === formData.sections.length - 1}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => removeSection(index)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {section.type === 'text' && <div dangerouslySetInnerHTML={{ __html: section.content.html?.substring(0, 100) + '...' }} />}
          {section.type === 'hero' && <div><strong>Title:</strong> {section.content.title}</div>}
          {section.type === 'image' && section.content.url && <img src={section.content.url} alt="Preview" className="max-w-xs mt-2" />}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Pages</h1>
          <button
            onClick={() => openModal()}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
          >
            Add New Page
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page._id}>
                    <td className="px-6 py-4">{page.title}</td>
                    <td className="px-6 py-4 text-gray-600">{page.slug}</td>
                    <td className="px-6 py-4">{page.sections?.length || 0} sections</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openModal(page)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(page._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full my-8 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                      placeholder="home, about, contact"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    rows="2"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Published</label>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Page Sections</h3>

                  {formData.sections.map((section, index) => renderSectionPreview(section, index))}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="font-bold mb-3">Add New Section</h4>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Type</label>
                      <select
                        value={currentSection.type}
                        onChange={(e) => setCurrentSection({ ...currentSection, type: e.target.value, content: {} })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="hero">Hero Section</option>
                        <option value="text">Text Content</option>
                        <option value="image">Image</option>
                        <option value="custom">Custom HTML</option>
                      </select>
                    </div>

                    {currentSection.type === 'hero' && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Hero Title"
                          value={currentSection.content.title || ''}
                          onChange={(e) => setCurrentSection({
                            ...currentSection,
                            content: { ...currentSection.content, title: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Hero Subtitle"
                          value={currentSection.content.subtitle || ''}
                          onChange={(e) => setCurrentSection({
                            ...currentSection,
                            content: { ...currentSection.content, subtitle: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Background Image URL"
                          value={currentSection.content.backgroundImage || ''}
                          onChange={(e) => setCurrentSection({
                            ...currentSection,
                            content: { ...currentSection.content, backgroundImage: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}

                    {currentSection.type === 'text' && (
                      <RichTextEditor
                        value={currentSection.content.html || ''}
                        onChange={(value) => setCurrentSection({
                          ...currentSection,
                          content: { ...currentSection.content, html: value }
                        })}
                      />
                    )}

                    {currentSection.type === 'image' && (
                      <div className="space-y-3">
                        <ImageUpload
                          onUploadSuccess={(url) => setCurrentSection({
                            ...currentSection,
                            content: { ...currentSection.content, url: url }
                          })}
                        />
                        {currentSection.content.url && (
                          <img
                            src={`${config.baseUrl}${currentSection.content.url}`}
                            alt="Preview"
                            className="max-w-xs rounded"
                          />
                        )}
                        <input
                          type="text"
                          placeholder="Image Caption (optional)"
                          value={currentSection.content.caption || ''}
                          onChange={(e) => setCurrentSection({
                            ...currentSection,
                            content: { ...currentSection.content, caption: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    )}

                    {currentSection.type === 'custom' && (
                      <textarea
                        rows="4"
                        placeholder="Custom HTML"
                        value={currentSection.content.html || ''}
                        onChange={(e) => setCurrentSection({
                          ...currentSection,
                          content: { ...currentSection.content, html: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      ></textarea>
                    )}

                    <button
                      type="button"
                      onClick={addSection}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Section
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                  >
                    {editingPage ? 'Update Page' : 'Create Page'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Page"
          message="Are you sure you want to delete this page? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
};

export default ManagePages;
