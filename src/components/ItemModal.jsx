import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ItemModal({ onClose }) {
  const [filter, setFilter] = useState("");
  const [allItems, setAllItems] = useState([]); // State để lưu toàn bộ danh sách
  const navigate = useNavigate();

  // Tự động gọi API để lấy tất cả tên khi modal được mở
  useEffect(() => {
    fetch(`${API_BASE_URL}/phivatthe/all-names`)
      .then((res) => res.json())
      .then((data) => setAllItems(data))
      .catch((err) => console.error("Lỗi fetch danh sách tên:", err));
  }, []); // Chỉ chạy 1 lần

  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Khi click vào một item, điều hướng đến trang chi tiết và đóng modal
  const handleClick = (id) => {
    navigate(`/detail/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Danh sách văn hóa</h2>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />

        <ul className="list-none p-0 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <li
              key={item.itemID}
              onClick={() => handleClick(item.itemID)}
              className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 rounded-md"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ItemModal;
