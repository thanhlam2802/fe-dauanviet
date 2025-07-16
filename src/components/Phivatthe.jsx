// import ItemMain from "../components/ItemMain";
// import ItemCard from "../components/ItemCard";
// import ItemModal from "../components/ItemModal";
import CultureModal from "./CultureModal";
import CultureCard from "./CultureCard";
import CultureMain from "./CultureMain";
import "./Phivatthe.css";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Thêm URL gốc của backend để hiển thị hình ảnh
const BACKEND_DOMAIN = "http://localhost:8080";

function Phivatthe() {
  const [mainItem, setMainItem] = useState(null);
  const [cards, setCards] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Hàm điều hướng đến trang chi tiết
  const handExplore = (item) => {
    navigate(`/detail/${item.itemID}`);
  };

  const handleNavigation = (itemID) => {
    const query = new URLSearchParams(location.search);
    query.set("startId", itemID);
    navigate(`?${query.toString()}`); // Cập nhật URL sẽ kích hoạt useEffect
  };

  useEffect(() => {
    // Lấy startId từ query params của URL, mặc định là 0
    const query = new URLSearchParams(location.search);
    const startId = query.get("startId") || 0;

    // Gọi API để lấy danh sách vật thể
    fetch(`${API_BASE_URL}/phivatthe/items?startId=${startId || ""}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Xử lý URL hình ảnh trước khi cập nhật state
        const processedMainItem = data.mainItem
          ? {
              ...data.mainItem,
              imageURL: `${BACKEND_DOMAIN}${data.mainItem.imageURL}`,
            }
          : null;

        const processedCards = data.cards.map((card) => ({
          ...card,
          imageURL: `${BACKEND_DOMAIN}${card.imageURL}`,
        }));

        setMainItem(processedMainItem);
        setCards(processedCards);
        setPageInfo(data.navigation);
      })
      .catch((err) => console.error("Lỗi fetch dữ liệu:", err));
  }, [location.search]); // Chạy lại effect khi URL query thay đổi

  return (
    <div className="main-section">
      {mainItem && <CultureMain item={mainItem} onExplore={handExplore} />}
      <div className="card-list">
        {cards.map((card) => (
          <CultureCard
            key={card.itemID}
            card={card}
            onClick={(selectedCard) => {
              // Cập nhật lại URL và mainItem
              const query = new URLSearchParams(location.search);
              query.set("startId", selectedCard.itemID);
              navigate(`?${query.toString()}`);
            }}
          />
        ))}
      </div>

      {pageInfo && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handleNavigation(pageInfo.prevID)}
          >
            &lt;
          </button>
          <button
            className="page-btn"
            onClick={() => handleNavigation(pageInfo.nextID)}
          >
            &gt;
          </button>
          <span className="page-number">
            Trang {pageInfo.currentPage} / {pageInfo.total}
          </span>
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="search search-fixed"
      >
        Danh sách văn hóa
      </button>
      {showModal && (
        <CultureModal
          onClose={() => setShowModal(false)}
          onSelectItem={(selected) => {
            handleNavigation(selected.itemID); // Gọi API để cập nhật mainItem và cards chính xác
            setShowModal(false); // Đóng modal
          }}
        />
      )}
    </div>
  );
}

export default Phivatthe;
