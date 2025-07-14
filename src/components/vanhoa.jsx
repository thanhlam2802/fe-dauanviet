import React from "react";

const vanhoa = () => {
  return (
    <div className=" bg-[var(--color-secondary)] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 w-full ">
      {/* CỘT TRÁI */}
      <div className="col-span-4 ">
        <div className="w-full">
          <img
            className="w-full h-41 pt-5 object-cover"
            src="../thanhpho.png"
            alt=""
          />
          <div className="w-full ">
            <h5 className="text-right mr-2 text-[var(--color-red)] ">
              ĐẶT VẤN ĐỀ
            </h5>
            <p className="text-xs mx-2 text-justify text-[var(--color-red)] ">
              Nhìn chung, trong quá trình hội nhập và phát triển, sự giao lưu và
              tiếp biến văn hóa, cùng với ảnh hưởng trực tiếp cũng như gián tiếp
              của nhiều trào lưu văn hóa mới, kết hợp với tác động mạnh mẽ của
              cơ chế thị trường, đã dẫn đến những thay đổi mang tính tiêu cực
              đối với các trò chơi dân gian của các dân tộc. Đặc biệt, giá trị
              của những trò chơi này đang có nguy cơ mai một, biến mất hoặc bị
              biến tướng một cách bất thường và nhanh chóng. Thay vào đó là các
              trò chơi mới được du nhập, không phù hợp với văn hóa và thể chất
              của con người Việt Nam.
            </p>
          </div>
        </div>
        <div className="w-full mt-5">
          <div className="grid grid-cols-4 gap-0">
            <div className="col-span-3">
              <h5 className="ml-2 text-[var(--color-red)]">ÍCH LỢI</h5>
              <p className="text-xs mx-2 text-justify text-[var(--color-red)]">
                Trò chơi dân gian dành cho trẻ không chỉ góp phần rèn luyện sức
                khỏe, kỹ năng ứng xử hợp lý với các tình huống trong cuộc sống,
                thói quen và kỹ năng làm việc, sinh hoạt theo nhóm, mà còn giúp
                các em rèn luyện khả năng nhận thức văn hóa, không sa vào những
                trò chơi trực tuyến bạo lực vô bổ đang tràn lan, hay các trò
                chơi hiện đại như kiếm, súng bằng nhựa gây nguy hiểm và các tệ
                nạn xã hội khác.
              </p>
            </div>
            <div className="col-span-1 pr-2 h-full ">
              <img
                src="../bitmat.png"
                alt=""
                className="h-full object-cover w-full"
              />
            </div>
          </div>
        </div>
        <div className="w-full mt-5">
          <div className="grid grid-cols-5 gap-0">
            <div className=" col-span-2 pr-2 h-full ">
              <img
                src="../bitmat.png"
                alt=""
                className="h-full object-cover w-full ml-2"
              />
            </div>
            <div className="col-span-3">
              <h5 className="ml-2 text-[var(--color-red)]">GIÁ TRỊ</h5>
              <p className="text-xs mx-2 text-justify text-[var(--color-red)]">
                Trò chơi dân gian cuốn hút mọi người bởi cách chơi đơn giản,
                không cầu kỳ, tốn kém nên có thể chơi mọi lúc, mọi nơi. Hơn thế,
                trò chơi dân gian thường diễn ra ngoài trời, trong khung cảnh
                thiên nhiên nên rất tốt cho sức khỏe con người. Thường thì những
                trò chơi này hay gắn liền với các câu đồng dao, ca dao, tục ngữ…
                nên dễ nhớ, dễ thuộc. Với những ưu thế đó, dần dần, trò chơi dân
                gian đã trở thành món ăn tinh thần không thể thiếu trong sự tồn
                tại và phát triển của con người Việt Nam.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-5">
          <div className="grid grid-cols-5 gap-0">
            <div className="col-start-3 col-span-3">
              <h5 className="ml-2 text-[var(--color-red)]">ƯƠN MẦM</h5>
            </div>
            <div className="col-span-5 pr-2 h-full mr-2 ">
              <p className="text-xs ml-2 text-justify text-[var(--color-red)]">
                Trò chơi dân gian cuốn hút mọi người bởi cách chơi đơn giản,
                không cầu kỳ, tốn kém nên có thể chơi mọi lúc, mọi nơi. Hơn thế,
                trò chơi dân gian thường diễn ra ngoài trời, trong khung cảnh
                thiên nhiên nên rất tốt cho sức khỏe con người. Thường thì những
                trò chơi này hay gắn liền với những câu đồng dao, ca dao, tục
                ngữ… nên dễ nhớ, dễ thuộc. Với những ưu thế đó, dần dần, trò
                chơi dân gian đã trở thành món ăn tinh thần không thể thiếu
                trong sự tồn tại và phát triển của con người Việt Nam.
              </p>
              {/* === THAY ĐỔI Ở ĐÂY === */}
              <img
                src="../uocman.jpeg"
                alt=""
                className="h-full object-cover w-full mx-2 mb-2 mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CỘT GIỮA */}
      <div className="col-span-4 bg-[var(--color-red)] items-center justify-center flex ">
        <div className="m-10   ">
          <div>
            <img
              src="../lan.jpeg"
              alt=""
              className="w-full h-20 mb-10 object-cover"
            />
          </div>

          <div className="w-full">
            <p className="text-[var(--color-secondary)] text-xs text-justify">
              Trong kho tàng văn hóa dân gian, trò chơi dân gian có một vị trí
              khá quan trọng, tạo nên diện mạo văn hóa truyền thống dân tộc, là
              bản thông điệp giàu sức truyền tải các giá trị nhân bản, nhân văn,
              mang ý nghĩa sâu sắc về tín ngưỡng và văn hóa.
            </p>
            <br />
            <p className="text-[var(--color-secondary)] text-xs text-justify">
              Trò chơi dân gian là một loại hình nghệ thuật được hình thành từ
              xa xưa và phát triển theo thời gian. Xuất phát từ cuộc sống của
              người dân lao động “một nắng hai sương”, vốn dĩ chỉ quanh quẩn
              trong làng xã, họ cần có một phương thức, phương tiện giải trí
              trong cuộc sống thường ngày.
            </p>
          </div>
          <h5 className="text-[var(--color-secondary)]  text-right mt-5">
            TRÒ CHƠI DÂN GIAN
          </h5>
          <img src="../mualan2.png" alt="" className=" mt-10" />
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="col-span-4">
        <div className=" mt-5 ">
          <h5 className="ml-2 text-[var(--color-red)] ">Ô ĂN QUAN</h5>
          <div className="grid grid-cols-2 gap-0 mr-2">
            <div className="col-span-1">
              <p className="text-xs mx-2 text-center text-[var(--color-red)]">
                "Mày ơi, đi nhặt sỏi nào <br />
                Búp măng chúm chím thả vào ô quan <br />
                Bao nhiêu lối dọc, đường ngang <br />
                Lính hèn áo đỏ, quan sang long hồng"
              </p>
              <br />
              <p className="text-xs mx-2 text-center text-[var(--color-red)]">
                Một ô vừa bốc, bỏ không <br />
                Tao vơ rồi đấy, mày trông đây này! <br />
                Có gì mày lại chơi hay? <br />
                Có khi lúc rảnh tay mày ăn gian...
              </p>
            </div>
            <img
              src="../anquan.png"
              alt=""
              className="h-full object-cover w-full "
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-5 gap-0">
          <div className="col-span-2 ml-2">
            <img
              src="../rongran.png"
              alt=""
              className="h-full object-cover w-full mr-2"
            />
          </div>

          <div className="col-span-3 mr-2">
            <h5 className=" text-[var(--color-red)] text-right mb-2">
              RỒNG RẮN LÊN MÂY
            </h5>
            <p className="text-right text-xs text-[var(--color-red)]">
              Rồng rắn lên mây <br /> Có cây lúc lắc <br /> Hỏi thăm thầy thuốc{" "}
              <br /> Có nhà hay không?
            </p>
          </div>
        </div>
        <div className=" mt-5">
          <h5 className="text-[var(--color-red)]  mx-2 text-justify w-full tracking-wider ">
            GÌN GIỮ -BẢO TỒN - PHÁT HUY <br />
            TRÒ CHƠI DÂN GIAN VIỆT NAM
          </h5>
          <div class="ml-2  mr-2">
            <img
              src="../te.jpeg"
              alt=""
              className=" object-cover w-full mt-2 "
            />
            <p className=" text-xs   mt-2 text-justify text-[var(--color-red)]">
              Nếu đa phần trò chơi dân gian của trẻ em có thể diễn ra mọi lúc,
              mọi nơi thì phần lớn trò chơi dân gian của người lớn thường diễn
              ra trong các lễ hội làng, ngày Tết cổ truyền, tại sân đình hay bãi
              đất trống rộng lớn trong làng. Đây chính là nơi hội tụ những giá
              trị văn hóa truyền thống cộng đồng, nơi giao lưu tình cảm làng xóm
              quê hương; là dịp để các thế hệ đua tài, đua sức và qua đó tạo nên
              mối cộng cảm, đoàn kết bền chặt, khơi dậy niềm tự hào chính đáng
              về những giá trị văn hóa và sự sáng tạo văn hóa của các vùng,
              miền, đất nước.
            </p>
            {/* === THAY ĐỔI Ở ĐÂY === */}
            <img
              src="../lan.jpeg"
              alt=""
              className="object-cover w-full mt-2 mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default vanhoa;
