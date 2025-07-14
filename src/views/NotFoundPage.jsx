import React from "react";
import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--color-secondary)] text-center px-4">
      <Frown className="w-24 h-24 text-[var(--color-red-2)] mb-6" />
      <h1 className="text-6xl font-extrabold text-[var(--color-red)] mb-4">
        404
      </h1>
      <h2 className="text-3xl font-semibold mb-3 text-[var(--color-red-2)]">
        Trang không tồn tại
      </h2>
      <p className="text-lg text-[var(--color-red)]/80 mb-8">
        Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-[var(--color-red)] text-[var(--color-secondary)] font-semibold  hover:bg-[var(--color-red-2)] transition-colors duration-300"
      >
        Quay về Trang Chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
