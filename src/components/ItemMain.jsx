import { motion as Motion } from "framer-motion";

const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE;

// Hàm tiện ích để lấy URL hình ảnh đầy đủ
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  return `${BACKEND_DOMAIN}${path}`;
};

function ItemMain({ item, onExplore }) {
  return (
    <Motion.div
      key={item.itemID}
      className="relative w-full h-full" // Thay đổi h-screen thành h-full
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <img
        className="w-full h-full object-cover"
        src={getImageUrl(item.imageURL)}
        alt={item.name}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start p-10 md:p-20 text-white">
        <Motion.h2
          className="text-5xl md:text-7xl font-bold max-w-2xl leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {item.name}
        </Motion.h2>
        <Motion.p
          className="text-lg md:text-xl max-w-md md:max-w-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {item.shortDescription}
        </Motion.p>
        <Motion.button
          className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition-colors"
          onClick={() => onExplore(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Khám phá
        </Motion.button>
      </div>
    </Motion.div>
  );
}

export default ItemMain;
