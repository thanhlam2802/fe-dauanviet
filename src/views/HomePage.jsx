import React from "react";
import { useState, useEffect, useRef } from "react";

import {
  MapPin,
  Newspaper,
  Car,
  Landmark,
  Mail,
  Phone,
  Map,
} from "lucide-react";
import { Facebook, Instagram, AtSign } from "lucide-react";
import { gsap } from "gsap";

import CircularGallery from "../components/CircularGallery";
import CardSwap, { Card } from "../components/CardSwap";
import AddressLookup from "../components/AddressLookup";
import QuizGame from "../components/QuizGame";
import VanHoa from "../components/vanhoa";
import HeritageSites from "../components/heritageSites";
import CongTrinhDetail from "../components/CongTrinhDetail";

function HomePage() {
  const cursorRef = useRef(null);

  return (
    <>
      <div>
        <main className="flex-grow px-[20px]">
          <section>
            <AddressLookup />
          </section>
          {/* Phần chú thích được giữ lại theo yêu cầu của bạn */}
          {/* <section
            id="kham-pha"
            className="border border-[var(--color-secondary)] my-16"
          >
            <div className="text-center mt-10 px-4">
              <p className="text-xl md:text-2xl text-[var(--color-secondary)] max-w-4xl mx-auto">
                Hành trình không chỉ là những con đường. Đó là sự{" "}
                <strong>KẾT NỐI</strong> giữa cao nguyên đại ngàn và biển xanh
                cát trắng. Hãy bắt đầu cuộc phiêu lưu, <strong>KHÁM PHÁ</strong>{" "}
                những nét văn hóa giao thoa độc đáo trên con đường{" "}
                <strong>HỘI NHẬP</strong> từ Gia Lai đến Bình Định.
              </p>
            </div>
            <div
              className="col-span-12"
              style={{ height: "600px", position: "relative" }}
            >
              <CircularGallery bend={3} textColor="#FFCB05" borderRadius={0} />
            </div>
          </section> */}
          {/* <section
            id="gioi-thieu"
            className="w-full grid grid-cols-12 gap-10 items-center justify-center mb-16"
          >
            <div className="col-span-12 bg-[var(--color-secondary)] h-[600px] pt-10 flex">
              <div className=" w-1/2 m-5 mr-auto bg-[var(--color-secondary)]">
                <div className=" mb-3">
                  <span className="text-3xl text-[var(--color-red)] ">
                    KẾT NỐI
                  </span>
                </div>
                <p className=" text-[var(--color-red)]">
                  Phá vỡ mọi khoảng cách, liên kết Gia Lai và Bình Định thông
                  qua hệ thống giao thông thuận tiện và nền tảng số hóa, mang
                  mọi người đến gần nhau hơn.
                </p>
              </div>
              <div className=" w-1/2 m-5 ml-auto bg-[var(--color-red)]">
                <div className="mb-3">
                  <span className="text-3xl text-[var(--color-secondary)]">
                    HỘI NHẬP
                  </span>
                </div>
                <p className="text-[var(--color-secondary)]">
                  Mở ra những cơ hội mới, thúc đẩy giao thoa kinh tế và văn hóa,
                  đưa tiềm năng của hai địa phương vươn ra biển lớn và hòa mình
                  vào dòng chảy phát triển chung.
                </p>
              </div>
            </div>
          </section> */}
          {/* <section>
            <QuizGame />
          </section> */}
          <section>
            <HeritageSites />
          </section>
          <section className="mt-10">
            <VanHoa />
          </section>
        </main>
      </div>
    </>
  );
}

export default HomePage;
