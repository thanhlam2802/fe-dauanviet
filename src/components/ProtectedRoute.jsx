import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // THAY ĐỔI QUAN TRỌNG:
  // Thay vì tìm 'isAuthenticated', chúng ta sẽ tìm 'accessToken'
  const token = localStorage.getItem("accessToken");

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    // Nếu không có token, chuyển hướng người dùng về trang đăng nhập.
    // Chúng ta cũng truyền vị trí hiện tại (`location`) để có thể
    // chuyển hướng họ trở lại sau khi đăng nhập thành công.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có token, hiển thị component con (chính là trang Dashboard).
  return children;
};

export default ProtectedRoute;
