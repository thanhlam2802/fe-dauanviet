import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const pageTransitionStyles = `
  .transition-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-red);
    z-index: 1000;
    pointer-events: none;
    transform: translateY(-100%);
    overflow: hidden;
  }

  .crane-image {
    position: absolute;
    top: 50%;
    left: -150px;
    transform: translateY(-50%);
    z-index: 1002;
    width: 120px;
    height: auto;
  }

  .leaves-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

.leaf {
    position: absolute;
    width: 20px;
    height: 20px;
    /* Thuộc tính fill="FFCB05" quyết định màu của lá */
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23FFCB05" d="M17.58,3.42C15.79,1.63,13.2,1,10.5,1C5.8,1,2,4.8,2,9.5c0,2.7,1.63,5.29,3.42,7.08L12,23l6.58-6.42C20.37,14.79,22,12.2,22,9.5C22,6.8,21.37,4.21,19.58,2.42L17.58,3.42z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
    opacity: 0;
  }
`;

const PageTransition = ({ isActive, onComplete }) => {
  const transitionRef = useRef(null);
  const craneRef = useRef(null);
  const leavesContainerRef = useRef(null);
  const timeline = useRef(null);

  const createAndDropLeaf = (startX) => {
    if (!leavesContainerRef.current || !craneRef.current) return;
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    const craneRect = craneRef.current.getBoundingClientRect();
    leaf.style.left = `${startX - Math.random() * 50}px`;
    leaf.style.top = `${craneRect.top + craneRect.height / 2}px`;
    leavesContainerRef.current.appendChild(leaf);
    gsap.to(leaf, {
      duration: 1.5 + Math.random(),
      y: window.innerHeight * 1.2,
      x: `+=${Math.random() * 100 - 50}`,
      opacity: 1,
      rotation: Math.random() * 360,
      ease: "power1.out",
      onComplete: () => {
        leaf.remove();
      },
    });
  };

  useEffect(() => {
    timeline.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    timeline.current
      .to(transitionRef.current, {
        duration: 0.5,
        y: "0%",
        ease: "power2.inOut",
      })
      .to(
        craneRef.current,
        {
          duration: 1.5,
          left: "110%",
          ease: "power1.inOut",
          onUpdate: function () {
            const craneX = craneRef.current.getBoundingClientRect().left;
            if (craneX > 0 && Math.random() > 0.7) {
              createAndDropLeaf(craneX);
            }
          },
        },
        "-=0.2"
      );

    return () => {
      timeline.current.kill();
    };
  }, [onComplete]);

  useEffect(() => {
    if (isActive) {
      gsap.set(craneRef.current, { clearProps: "all" });

      timeline.current.play(0);
    } else {
      gsap.to(transitionRef.current, {
        duration: 0.5,
        y: "-100%",
        ease: "power2.inOut",
        onComplete: () => {
          if (leavesContainerRef.current) {
            leavesContainerRef.current.innerHTML = "";
          }
        },
      });
    }
  }, [isActive]);

  return (
    <>
      <style>{pageTransitionStyles}</style>
      <div className="transition-layer" ref={transitionRef}>
        <img
          ref={craneRef}
          className="crane-image"
          src="/hat3.png"
          alt="Con hạc đang bay"
        />
        <div className="leaves-container" ref={leavesContainerRef}></div>
      </div>
    </>
  );
};

export default PageTransition;
