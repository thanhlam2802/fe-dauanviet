import React from "react";

<footer className="bg-[var(--color-secondary)] mt-10 text-[var(--color-red)]">
  <div className="w-full py-12 px-5">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 text-center md:text-left">
      {/* Cột thông tin chính (không đổi) */}
      <div className="space-y-2 md:col-span-6  bg-[var(--color-red)] ">
        <p className="text-2xl font-light text-[var(--color-secondary)]">
          Dấu ấn Việt
        </p>
        <p className="text-sm text-[var(--color-secondary)]">
          Sáng kiến cá nhân nhằm số hóa thông tin văn hóa, du lịch và đặc sản
          địa phương, kết nối cộng đồng từ cao nguyên đến duyên hải
        </p>
        <div className="flex space-x-4 text-[var(--color-secondary)] justify-center md:justify-start pt-2">
          <a href="#" className="hover:opacity-75 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" className="hover:opacity-75 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="hover:opacity-75 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Cột Cùng đồng hành */}
      <div className="md:col-span-3 flex flex-col justify-between">
        <h3 className="text-2xl font-light">Cùng đồng hành</h3>
        <div className="flex mt-2 items-center justify-center md:justify-start gap-x-5">
          <a
            href="https://www.thewinhouse.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Winhouse"
          >
            {/* Thay đổi kích thước logo: h-10 trên mobile, h-14 trên desktop */}
            <img
              src="./logowinhouse.jpg"
              alt="Winhouse"
              className="h-10 md:h-14 w-auto transition-opacity hover:opacity-80"
            />
          </a>
          <a
            href="https://thefubo.com"
            target="_blank"
            rel="noopener noreferrer"
            title="thefubo"
          >
            <img
              src="./logofubo.jpg"
              alt="thefubo"
              className="h-10 md:h-14 w-auto transition-opacity hover:opacity-80"
            />
          </a>
        </div>
      </div>

      {/* Cột liên hệ */}
      <div className="flex flex-col justify-between md:col-span-3 ">
        <h3 className="text-2xl font-light">Liên hệ</h3>
        {/* Giảm khoảng cách giữa các dòng liên hệ trên mobile */}
        <ul className="space-y-2 md:space-y-3 text-sm">
          <li className="flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-3 shrink-0"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>baolethanhlam2001@gmail.com</span>
          </li>
          <li className="flex items-center justify-center md:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 mr-3 shrink-0"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>info@thewinhouse.com</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright (không đổi) */}
    <div className="mt-8 pt-4 border-t border-[var(--color-red)] text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} Dự án bởi dev_nha_que – winhouse
      </p>
    </div>
  </div>
</footer>;
const Footer = () => {
  return (
    <footer className="bg-[var(--color-secondary)] mt-10 text-[var(--color-red)]">
      <div className="w-full py-12 px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 text-center md:text-left">
          {/* Cột thông tin chính (không đổi) */}
          <div className="space-y-2 md:col-span-6  bg-[var(--color-red)] ">
            <p className="text-2xl font-light text-[var(--color-secondary)]">
              Dấu ấn Việt
            </p>
            <p className="text-sm text-[var(--color-secondary)]">
              Sáng kiến cá nhân nhằm số hóa thông tin văn hóa, du lịch và đặc
              sản địa phương, kết nối cộng đồng từ cao nguyên đến duyên hải
            </p>
            <div className="flex space-x-4 text-[var(--color-secondary)] justify-center md:justify-start pt-2">
              <a href="#" className="hover:opacity-75 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Cột Cùng đồng hành */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <h3 className="text-2xl font-light">Cùng đồng hành</h3>
            <div className="flex mt-2 items-center justify-center md:justify-start gap-x-5">
              <a
                href="https://www.thewinhouse.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Winhouse"
              >
                {/* Thay đổi kích thước logo: h-10 trên mobile, h-14 trên desktop */}
                <img
                  src="./logowinhouse.jpg"
                  alt="Winhouse"
                  className="h-10 md:h-14 w-auto transition-opacity hover:opacity-80"
                />
              </a>
              <a
                href="https://thefubo.com"
                target="_blank"
                rel="noopener noreferrer"
                title="thefubo"
              >
                {/* Thay đổi kích thước logo: h-10 trên mobile, h-14 trên desktop */}
                <img
                  src="./logofubo.jpg"
                  alt="thefubo"
                  className="h-10 md:h-14 w-auto transition-opacity hover:opacity-80"
                />
              </a>
            </div>
          </div>

          {/* Cột liên hệ */}
          <div className="flex flex-col justify-between md:col-span-3 ">
            <h3 className="text-2xl font-light">Liên hệ</h3>
            {/* Giảm khoảng cách giữa các dòng liên hệ trên mobile */}
            <ul className="space-y-2 md:space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mr-3 shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span>baolethanhlam2001@gmail.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mr-3 shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span>info@thewinhouse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright (không đổi) */}
        <div className="mt-8 pt-4 border-t border-[var(--color-red)] text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Dự án bởi dev_nha_que – winhouse
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
