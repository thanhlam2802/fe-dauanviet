import apiClient from "../api/apiClient";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FilePlus, LogOut, Landmark } from "lucide-react";
import OldInfoTab from "../views/OldInfoTab";
import NewInfoTab from "../views/NewInfoTab";
import HeritageManagerTab from "../views/HeritageFormModal";

function TourManager() {
  const [activeTab, setActiveTab] = useState("oldInfo");
  const navigate = useNavigate();

  const tabs = [
    { id: "heritageManager", name: "Quản lý Di sản", icon: Landmark },
    { id: "oldInfo", name: "Thông tin cũ (Tỉnh)", icon: FileText },
    { id: "newInfo", name: "Thông tin mới (Tỉnh)", icon: FilePlus },
  ];

  // 3. Thêm case cho component mới
  const CurrentTabComponent = useMemo(() => {
    switch (activeTab) {
      case "heritageManager":
        return HeritageManagerTab;
      case "oldInfo":
        return OldInfoTab;
      case "newInfo":
        return NewInfoTab;
      default:
        return HeritageManagerTab;
    }
  }, [activeTab]);

  // THAY ĐỔI HÀM NÀY
  const handleLogout = async () => {
    try {
      // Gọi API tới backend để thông báo đăng xuất (không bắt buộc nhưng là good practice)
      // Endpoint này chúng ta sẽ tạo ở Bước 2
      await apiClient.post("/auth/logout.php");
    } catch (error) {
      console.error(
        "Lỗi khi gọi API đăng xuất, nhưng vẫn sẽ đăng xuất ở client:",
        error
      );
    } finally {
      // Luôn xóa token ở client dù API có thành công hay không
      localStorage.removeItem("accessToken"); // <-- Sửa từ "isAuthenticated" thành "accessToken"

      // Chuyển hướng người dùng về trang đăng nhập
      navigate("/login");
    }
  };

  return (
    // ... Phần JSX của bạn giữ nguyên ...
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg flex flex-col">
          <div>
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">QUẢN LÝ TỈNH</h1>
              <p className="text-sm text-gray-600">Quản lý xác nhập tỉnh</p>
            </div>
            <nav className="mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700"
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <CurrentTabComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourManager;
