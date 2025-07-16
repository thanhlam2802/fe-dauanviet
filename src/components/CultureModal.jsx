import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// export default CultureModal
function CultureModal({ onClose, cards, onSelectItem }) {
  const [filter, setFilter] = useState("");
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/phivatthe/all-names`)
      .then((res) => res.json())
      .then((data) => setAllItems(data))
      .catch((err) => console.error("Lỗi fetch danh sách tên:", err));
  }, []);

  const filterItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleClick = (item) => {
    if (onSelectItem) onSelectItem(item);
    onClose(); // đóng modal
  };
  
  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Danh sách văn hóa</h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          id="filterInput"
        />
        <ul id="cultureList">
          {filterItems.map((c) => (
            <li key={c.itemID} onClick={() => handleClick(c)}>
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CultureModal;
