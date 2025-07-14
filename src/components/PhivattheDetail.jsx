import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

// Định nghĩa URL cơ sở cho API và hình ảnh - ĐÃ CẬP NHẬT

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE;

// Hàm tiện ích để lấy URL hình ảnh đầy đủ
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  return `${BACKEND_DOMAIN}${path}`;
};

// Component nội bộ để render một section chi tiết
function ContentSection({ section, index }) {
  const isReverse = index % 2 === 1;

  const variants = {
    hidden: { opacity: 0, x: isReverse ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <Motion.div
      className={`flex items-stretch gap-10 mb-16 max-md:flex-col ${
        isReverse ? "flex-row-reverse" : "flex-row"
      }`}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <img
        src={`${getImageUrl}${section.imageURL}`}
        alt={section.title}
        className="flex-shrink-0 object-contain md:w-1/2"
      />
      <div className="flex-1 text-black">
        <h2 className="text-2xl font-bold mb-3 font-heading">
          {section.title}
        </h2>
        <p className="text-base leading-relaxed text-justify">
          {section.content}
        </p>
      </div>
    </Motion.div>
  );
}

function PhivattheDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const [details, setDetails] = useState(null);

  useEffect(() => {
    document.body.className = "bg-red-700";

    // Gọi API mới để lấy chi tiết vật thể
    fetch(`${API_BASE_URL}/phivatthe/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setDetails(data.details); // API trả về { details: [...] }
        }
      })
      .catch((err) => console.error("Lỗi fetch chi tiết:", err));

    return () => {
      document.body.className = "";
    };
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto p-5 sm:p-10 bg-yellow-300">
      {details ? (
        details.map((section, index) => (
          <ContentSection key={index} section={section} index={index} />
        ))
      ) : (
        <p className="text-center text-xl text-black">Đang tải chi tiết...</p>
      )}
    </div>
  );
}

export default PhivattheDetail;
