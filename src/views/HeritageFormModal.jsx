import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";
import {
  Edit,
  Trash2,
  PlusCircle,
  X,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";

const HeritageFormModal = ({ heritage, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: "",
    ten: "",
    dia_diem: "",
    mo_ta: "",
    nam_xay_dung: "",
    loai_hinh: "",
    layout: "default",
    anh_dai_dien_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (heritage) {
      setFormData(heritage);
      if (heritage.anh_dai_dien_url) {
        const API_BASE_URL = process.env.REACT_APP_API_BASE;
        setImagePreview(`${API_BASE_URL}${heritage.anh_dai_dien_url}`);
      }
    } else {
      // Reset form cho trường hợp tạo mới
      setFormData({
        id: "",
        ten: "",
        dia_diem: "",
        mo_ta: "",
        nam_xay_dung: "",
        loai_hinh: "",
        layout: "default",
        anh_dai_dien_url: "",
      });
      setImagePreview("");
    }
  }, [heritage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData, imageFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {heritage ? "Chỉnh sửa Di sản" : "Thêm Di sản mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-6 space-y-4"
        >
          {/* Các trường input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID (ví dụ: 'ngo-mon-hue')
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={!!heritage}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên Di sản
              </label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa điểm
              </label>
              <input
                type="text"
                name="dia_diem"
                value={formData.dia_diem}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Năm xây dựng
              </label>
              <input
                type="text"
                name="nam_xay_dung"
                value={formData.nam_xay_dung}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại hình
              </label>
              <input
                type="text"
                name="loai_hinh"
                value={formData.loai_hinh}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Layout
              </label>
              <select
                name="layout"
                value={formData.layout}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="default">Default</option>
                <option value="classic">Classic</option>
                <option value="full_image">Full Image</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ảnh đại diện
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-32 h-20 bg-gray-100 rounded-md flex items-center justify-center border">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <ImageIcon className="text-gray-400" size={32} />
                )}
              </div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UploadCloud size={16} className="inline-block mr-2" />
                <span>Chọn ảnh</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </form>
        <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// Component chính để hiển thị danh sách và quản lý
const HeritageManagerTab = () => {
  const [heritages, setHeritages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHeritage, setCurrentHeritage] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const fetchHeritages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/disanvanhoa/");
      setHeritages(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách di sản:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeritages();
  }, [fetchHeritages]);

  const handleOpenModal = (heritage = null) => {
    setCurrentHeritage(heritage);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentHeritage(null);
  };

  const handleSave = async (formData, imageFile) => {
    try {
      let savedData;
      // Logic cho Sửa
      if (currentHeritage) {
        const response = await apiClient.put(
          `/disanvanhoa/${currentHeritage.id}`,
          formData
        );
        savedData = response.data;
      }
      // Logic cho Tạo mới
      else {
        const response = await apiClient.post("/disanvanhoa/", formData);
        savedData = response.data;
      }

      // Nếu có ảnh mới, thực hiện upload
      if (imageFile && savedData && savedData.id) {
        const uploadFormData = new FormData();
        uploadFormData.append("id", savedData.id);
        uploadFormData.append("image", imageFile);

        // Sử dụng header 'multipart/form-data' cho việc upload file
        await apiClient.post("/disanvanhoa/upload.php", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleCloseModal();
      fetchHeritages(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi lưu di sản:", error);
      // Thêm thông báo lỗi cho người dùng ở đây
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa di sản này?")) {
      try {
        await apiClient.delete(`/disanvanhoa/${id}`);
        fetchHeritages(); // Tải lại danh sách
      } catch (error) {
        console.error("Lỗi khi xóa di sản:", error);
      }
    }
  };

  if (loading)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Danh sách Di sản Văn hóa
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Thêm Di sản mới
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Di sản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {heritages.map((heritage) => (
              <tr key={heritage.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={`${API_BASE_URL}${heritage.anh_dai_dien_url}`}
                    alt={heritage.ten}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x60/eee/ccc?text=No+Image";
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {heritage.ten}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {heritage.dia_diem}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(heritage)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(heritage.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <HeritageFormModal
          heritage={currentHeritage}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default HeritageManagerTab;
