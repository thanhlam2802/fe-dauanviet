import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE;

// Hàm tiện ích để lấy URL hình ảnh đầy đủ
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  return `${BACKEND_DOMAIN}${path}`;
};

function ItemCard({ card }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/detail/${card.itemID}`);
  };

  return (
    <Motion.div
      onClick={handleClick}
      className="relative w-[250px] h-[350px] rounded-xl overflow-hidden shadow-lg cursor-pointer block flex-shrink-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <img
        className="w-full h-full object-cover"
        src={getImageUrl(card.imageURL)}
        alt={card.name}
      />
      <div className="absolute bottom-0 left-0 w-full p-4 text-white text-2xl font-bold text-center bg-gradient-to-t from-black/70 to-transparent">
        {card.name}
      </div>
    </Motion.div>
  );
}

export default ItemCard;
