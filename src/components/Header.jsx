import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTransition } from "../context/TransitionContext";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { playTransition } = useTransition(); // Lấy hàm playTransition từ context
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Hàm điều hướng chung để tái sử dụng
  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    playTransition(() => {
      navigate(path);
    });
  };

  return (
    <>
      <header className="px-5 py-4 pt-5 sm:pt-5">
        <div className="">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" onClick={handleNavigate("/")}>
                <span className="text-2xl font-light text-[var(--color-secondary)]">
                  Dấu Ấn Việt
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link
                    to="/phivatthe"
                    onClick={handleNavigate("/phivatthe")}
                    className="text-base font-medium text-[var(--color-secondary)] hover:opacity-80 transition-opacity duration-300"
                  >
                    Văn Hóa Phi Vật Thể
                  </Link>
                </li>
                {/* Thêm các mục nav khác ở đây nếu cần */}
              </ul>
            </nav>

            {/* Thời gian */}
            <div className="text-[var(--color-secondary)] text-right flex-shrink-0">
              <p className="font-semibold">VN</p>
              <p className="text-sm">
                {`${currentTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Ho_Chi_Minh",
                })} ${currentTime.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  timeZone: "Asia/Ho_Chi_Minh",
                })}`}
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
