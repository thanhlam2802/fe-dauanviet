import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// 1. IMPORT CÁC THÀNH PHẦN CẦN THIẾT
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import PageTransition from "./PageTransition";
import "./CongTrinhDetail.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ContentText = React.forwardRef(
  ({ ten, dia_diem, nam_xay_dung, mo_ta }, ref) => {
    const paragraphs = mo_ta
      ? mo_ta.split("\n").filter((p) => p.trim() !== "")
      : [];

    return (
      <div ref={ref} className="content-text opacity-0 ">
        <div className="content-text-header">
          <h1>{ten}</h1>
          <p className="meta-info">
            <strong>Địa điểm:</strong> {dia_diem} |{" "}
            <strong>Năm xây dựng:</strong> {nam_xay_dung}
          </p>
        </div>
        <div className="description">
          {paragraphs.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>
      </div>
    );
  }
);

const ContentImage = React.forwardRef(({ url, ten }, ref) => {
  const fullImageUrl = url.startsWith("http")
    ? url
    : `${process.env.REACT_APP_API_BASE}${url}`;

  return (
    <div ref={ref} className="content-image opacity-0">
      <img src={fullImageUrl} alt={`Ảnh của ${ten}`} />
    </div>
  );
});

const CongTrinhDetail = () => {
  const navigate = useNavigate(); // Sử dụng hook useNavigate của react-router
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. THÊM STATE ĐỂ ĐIỀU KHIỂN HIỆU ỨNG CHUYỂN TRANG
  const [isNavigatingBack, setNavigatingBack] = useState(false);

  const imageRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Không tìm thấy ID của di sản trong URL.");
      return;
    }

    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/disanvanhoa/${id}`);
        if (!response.ok) {
          throw new Error(`Không tìm thấy dữ liệu (Lỗi: ${response.status})`);
        }
        const result = await response.json();
        if (!result || Object.keys(result).length === 0) {
          throw new Error(`Không có dữ liệu trả về cho ID: ${id}`);
        }
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi fetch chi tiết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  useLayoutEffect(() => {
    if (data && imageRef.current && textRef.current) {
      const ctx = gsap.context(() => {
        const elementsToAnimate =
          data.layout === "classic"
            ? [textRef.current, imageRef.current]
            : [imageRef.current, textRef.current];

        gsap.fromTo(
          elementsToAnimate,
          { y: 50, opacity: 0 },
          {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power3.out",
            stagger: 0.2,
            delay: 0.2,
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [data]);

  // 3. TẠO CÁC HÀM XỬ LÝ VIỆC CHUYỂN TRANG

  /**
   * Kích hoạt hiệu ứng khi nhấn nút back.
   */
  const handleNavigateBack = () => {
    setNavigatingBack(true);
  };

  const handleTransitionComplete = () => {
    navigate(-1); // Quay về trang trước đó
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-bold mt-20">Đang tải...</div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-xl font-bold text-[var(--color-red)] mt-20">
        Lỗi: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-center text-xl font-bold mt-20">
        Không có dữ liệu.
      </div>
    );
  }

  const layoutClassName = `layout-container layout-${data.layout}`;

  const renderLayout = () => {
    // ... (phần renderLayout giữ nguyên)
    switch (data.layout) {
      case "classic":
        return (
          <>
            <ContentText ref={textRef} {...data} />
            <ContentImage
              ref={imageRef}
              url={data.anh_dai_dien_url}
              ten={data.ten}
            />
          </>
        );
      case "full_image":
        return (
          <>
            <ContentText ref={textRef} {...data} />
            <ContentImage
              ref={imageRef}
              url={data.anh_dai_dien_url}
              ten={data.ten}
            />
          </>
        );
      default:
        return (
          <>
            <ContentImage
              ref={imageRef}
              url={data.anh_dai_dien_url}
              ten={data.ten}
            />
            <ContentText ref={textRef} {...data} />
          </>
        );
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* 4. THÊM COMPONENT HIỆU ỨNG VÀO JSX */}
      <PageTransition
        isActive={isNavigatingBack}
        onComplete={handleTransitionComplete}
      />

      <button
        onClick={handleNavigateBack}
        className="
          absolute top-0 left-5 z-10 
          flex items-center gap-x-2 
        
          bg-white/5 
          text-[var(--color-red)]
          font-semibold 
          hover:bg-[var(--color-secondary)]  transition-all duration-200 
        "
      >
        <ArrowLeft size={20} />
      </button>
      <div className={layoutClassName}>{renderLayout()}</div>
    </div>
  );
};

export default CongTrinhDetail;
