import { motion as Motion } from 'framer-motion'

const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE;

// Hàm tiện ích để lấy URL hình ảnh đầy đủ
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  return `${BACKEND_DOMAIN}${path}`;
};

function CultureMain({ item, onExplore }) {
  return (
    <Motion.div
      className="culture"
      key={item.itemID}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformOrigin: 'center center' }}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
        damping: 15
      }}
    >
      <img
        className="main-img" src={getImageUrl(item.imageURL)} alt=""/>
      <div className="overlay">
        <Motion.h2
          className="name-culture"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {item.name}
        </Motion.h2>
        <Motion.p
          className="introduction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {item.shortDescription}
        </Motion.p>
        <Motion.button
          className="explore"
          onClick={() => onExplore(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.2 }}
        >
          Khám phá
        </Motion.button>
      </div>
    </Motion.div>
  )
}

export default CultureMain
