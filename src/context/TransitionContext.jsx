import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import PageTransition from "../components/PageTransition"; // Đảm bảo đường dẫn chính xác

// Tạo Context
const TransitionContext = createContext();

// Tạo Provider Component
export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // SỬ DỤNG useRef ĐỂ LƯU HÀM CALLBACK
  // Ref sẽ giữ cho hàm callback luôn được cập nhật mà không gây render lại.
  const onCompleteCallback = useRef(null);

  const playTransition = useCallback((callback) => {
    // Lưu hàm callback mới nhất vào ref.
    onCompleteCallback.current = callback;
    setIsTransitioning(true);
  }, []);

  const handleTransitionComplete = () => {
    // Kiểm tra xem có hàm callback trong ref không và thực thi nó.
    if (onCompleteCallback.current) {
      onCompleteCallback.current();
    }

    // Reset lại trạng thái để sẵn sàng cho lần chuyển trang tiếp theo.
    setIsTransitioning(false);
    onCompleteCallback.current = null;
  };

  return (
    <TransitionContext.Provider value={{ playTransition }}>
      {children}
      <PageTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />
    </TransitionContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useTransition = () => {
  return useContext(TransitionContext);
};
