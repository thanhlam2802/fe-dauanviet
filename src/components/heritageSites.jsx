import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
const API_BASE_URL = process.env.REACT_APP_API_BASE;

const HeritageSlider = () => {
  const navigate = useNavigate();
  const pathRef = useRef(null);
  const slidingGroupRef = useRef(null);
  const animatedBirdRef = useRef(null);
  const prevIndexRef = useRef(0);

  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem("sliderCurrentIndex");
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const [sitePositions, setSitePositions] = useState([]);
  const [displayedSiteIndex, setDisplayedSiteIndex] = useState(currentIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchHeritageData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/disanvanhoa/`);
        if (!response.ok) {
          throw new Error(`Lỗi khi gọi API: ${response.status}`);
        }
        const data = await response.json();
        setHeritageSites(data);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeritageData();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("sliderCurrentIndex", currentIndex);
  }, [currentIndex]);

  const displayedSite = heritageSites[displayedSiteIndex];

  const ITEM_SPACING = 400;
  const VIEWPORT_CENTER = 500;
  const BIRD_ICON_SIZE = 40;
  const DOT_RADIUS = 8;

  useEffect(() => {
    if (heritageSites.length === 0) return;

    const pathElement = pathRef.current;
    if (!pathElement) return;

    const pathLength = pathElement.getTotalLength();
    const positions = heritageSites.map((site, index) => {
      const distance = index * ITEM_SPACING;
      const point = pathElement.getPointAtLength(200 + distance);
      return { ...site, x: distance, y: point.y };
    });

    setSitePositions(positions);

    if (
      positions.length > 0 &&
      animatedBirdRef.current &&
      slidingGroupRef.current
    ) {
      const initialSite = positions[currentIndex];

      if (initialSite) {
        const initialTargetX = initialSite.x - VIEWPORT_CENTER;
        gsap.set(animatedBirdRef.current, {
          x: initialSite.x,
          y: initialSite.y,
          scaleX: 1,
        });
        gsap.set(slidingGroupRef.current, { x: -initialTargetX });
      }
    }
  }, [heritageSites]);

  useEffect(() => {
    if (
      !sitePositions.length ||
      !slidingGroupRef.current ||
      !animatedBirdRef.current ||
      !sitePositions[currentIndex]
    )
      return;
    if (currentIndex === displayedSiteIndex) {
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    const targetSite = sitePositions[currentIndex];
    let direction = currentIndex > prevIndexRef.current ? 1 : -1;
    const targetX = targetSite.x - VIEWPORT_CENTER;

    gsap.to(slidingGroupRef.current, {
      duration: 1.2,
      ease: "power3.inOut",
      x: -targetX,
      onComplete: () => {
        setDisplayedSiteIndex(currentIndex);
        setIsAnimating(false);
      },
    });

    gsap.to(animatedBirdRef.current, {
      duration: 1.2,
      ease: "power3.inOut",
      x: targetSite.x,
      y: targetSite.y,
      scaleX: direction,
      transformOrigin: "center center",
    });

    prevIndexRef.current = currentIndex;
  }, [currentIndex, sitePositions, displayedSiteIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => Math.min(prev + 1, heritageSites.length - 1));
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const pathWidth = (heritageSites.length - 1) * ITEM_SPACING;
  const longPathD = `M -200 250 L 0 250 C ${pathWidth / 4} 50, ${
    (pathWidth * 3) / 4
  } 450, ${pathWidth} 250 L ${pathWidth + 200} 250`;

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-bold">
        Đang tải dữ liệu...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-20 text-xl font-bold text-red-600">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="relative pb-2 flex flex-col items-center mt-10 w-full px-2">
      {/* Tiêu đề đã được làm nhỏ hơn trên di động */}
      <h1 className="text-[var(--color-secondary)] text-2xl text-center sm:text-4xl font-extrabold mb-3 mt-5">
        MỘT VÒNG DI SẢN KIẾN TRÚC
      </h1>

      {/* Giới hạn chiều rộng và cho phép SVG tràn ra */}
      <div className="w-full max-w-4xl overflow-hidden">
        {/* SVG có chiều cao thay đổi theo màn hình */}
        <svg
          width="100%"
          viewBox="0 0 1000 400"
          className="h-[300px] sm:h-[400px]"
        >
          <g ref={slidingGroupRef}>
            <path
              ref={pathRef}
              d={longPathD}
              stroke="#FFCB05"
              strokeWidth="5"
              fill="none"
              strokeDasharray="10, 10"
            />
            {sitePositions.map((site) => (
              <g
                key={site.id}
                className="cursor-pointer group"
                onClick={() => navigate(`/heritage/${site.id}`)}
              >
                <circle
                  cx={site.x}
                  cy={site.y}
                  r={DOT_RADIUS}
                  fill="white"
                  stroke="#FFCB05"
                  strokeWidth="6"
                />
                <text
                  x={site.x}
                  y={site.y - (DOT_RADIUS + 10)}
                  textAnchor="middle"
                  // Kích thước chữ nhỏ hơn trên di động
                  className="text-sm sm:text-base font-bold fill-[var(--color-secondary)] pointer-events-none"
                >
                  {site.ten.toUpperCase()}
                </text>
              </g>
            ))}
            <image
              ref={animatedBirdRef}
              href="./hat3.png"
              width={BIRD_ICON_SIZE + 50}
              height={BIRD_ICON_SIZE + 50}
              transform={`translate(-${(BIRD_ICON_SIZE + 50) / 2}, -${
                (BIRD_ICON_SIZE + 50) / 2
              })`}
            />
            {displayedSite && sitePositions[displayedSiteIndex] && (
              // Khung ảnh preview được làm nhỏ lại để phù hợp hơn
              <foreignObject
                key={displayedSite.id}
                x={sitePositions[displayedSiteIndex].x - 60} // Căn giữa cho kích thước mới
                y={sitePositions[displayedSiteIndex].y - 130} // Đẩy lên cao hơn một chút
                width="120"
                height="80"
                className="pointer-events-none overflow-visible animate-fade-in"
              >
                <div className="p-1 w-full h-full bg-[var(--color-secondary)] ">
                  <img
                    src={`${API_BASE_URL}${displayedSite.anh_dai_dien_url}`}
                    alt={displayedSite.ten}
                    className="w-full h-full object-cover "
                  />
                </div>
              </foreignObject>
            )}
          </g>
        </svg>
      </div>

      {/* Các nút điều hướng đã responsive từ trước */}
      <div className="flex space-x-4 ">
        <button
          onClick={handlePrev}
          disabled={isAnimating || currentIndex === 0}
          className="border border-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
        >
          <img
            src="./hat3.png"
            alt="Lui"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            style={{ transform: "scaleX(-1)" }}
          />
        </button>
        <button
          onClick={handleNext}
          disabled={isAnimating || currentIndex === heritageSites.length - 1}
          className="border border-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
        >
          <img
            src="./hat3.png"
            alt="Tới"
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default HeritageSlider;
