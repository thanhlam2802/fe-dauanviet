import ItemMain from "../components/ItemMain";
import ItemCard from "../components/ItemCard";
import ItemModal from "../components/ItemModal";

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
  const handleExplore = (item) => {
    navigate(`/detail/${item.itemID}`);
  };

  useEffect(() => {
    // Lấy startId từ query params của URL, mặc định là 0
    const query = new URLSearchParams(location.search);
    const startId = query.get("startId") || 0;

    // Gọi API để lấy danh sách vật thể
    fetch(`${API_BASE_URL}/phivatthe/items?startId=${startId}`)
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
    <div className="bg-black min-h-screen overflow-hidden flex flex-row text-white">
      {/* Cột trái: Nội dung chính */}
      <div className="w-1/2 h-screen">
        {mainItem && <ItemMain item={mainItem} onExplore={handleExplore} />}
      </div>

      {/* Cột phải: Danh sách thẻ và phân trang */}
      <div className="w-1/2 h-screen flex flex-col p-8">
        <div className="flex justify-between items-center flex-shrink-0 mb-6">
          <h2 className="text-3xl font-bold">Khám phá thêm</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors"
          >
            Danh sách
          </button>
        </div>

        {/* Vùng chứa thẻ có thể cuộn ngang */}
        <div className="flex-grow overflow-x-auto pb-4 flex items-center">
          <div className="flex flex-row space-x-6">
            {cards.map((card) => (
              <ItemCard key={card.itemID} card={card} />
            ))}
          </div>
        </div>

        {/* Phân trang ở dưới cùng của cột phải */}
        {pageInfo && (
          <div className="flex-shrink-0 mt-6 flex items-center justify-center gap-4">
            <a
              href={`?startId=${pageInfo.prevStartId}`}
              className="bg-yellow-500 text-black w-10 h-10 flex items-center justify-center rounded-full font-bold hover:bg-green-500 transition-colors"
            >
              &lt;
            </a>
            <span className="text-lg text-white">
              Trang {pageInfo.currentPage} / {pageInfo.total}
            </span>
            <a
              href={`?startId=${pageInfo.nextStartId}`}
              className="bg-yellow-500 text-black w-10 h-10 flex items-center justify-center rounded-full font-bold hover:bg-green-500 transition-colors"
            >
              &gt;
            </a>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && <ItemModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Phivatthe;
