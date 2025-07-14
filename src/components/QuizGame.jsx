import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2   bg-[var(--color-red)] text-[var(--color-secondary)] hover:bg-[var(--color-red)]/80  transition-all duration-200 ${
      props.className || ""
    }`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[var(--color-secondary)]  shadow-xl ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const questions = [
  {
    question: "Gia Lai thuộc vùng nào của Việt Nam?",
    options: [
      "A. Đông Nam Bộ",
      "B. Tây Nguyên",
      "C. Đồng bằng sông Cửu Long",
      "D. Bắc Trung Bộ",
    ],
    answer: 1,
  },
  {
    question: "Thành phố nào là trung tâm hành chính của Gia Lai?",
    options: ["A. Pleiku", "B. An Khê", "C. Ayun Pa", "D. Kon Tum"],
    answer: 0,
  },
  {
    question: "Gia Lai giáp tỉnh nào sau đây?",
    options: ["A. Đắk Lắk", "B. Bình Định", "C. Quảng Nam", "D. Phú Yên"],
    answer: 0,
  },
  {
    question: "Đặc sản nổi tiếng của Gia Lai là gì?",
    options: ["A. Cơm hến", "B. Phở khô", "C. Bún bò", "D. Bánh bèo"],
    answer: 1,
  },
  {
    question: "Gia Lai nổi tiếng với loại cà phê nào?",
    options: ["A. Arabica", "B. Robusta", "C. Espresso", "D. Latte"],
    answer: 1,
  },
  {
    question: "Tỉnh Bình Định thuộc vùng nào?",
    options: [
      "A. Tây Nguyên",
      "B. Bắc Trung Bộ",
      "C. Nam Trung Bộ",
      "D. Đông Nam Bộ",
    ],
    answer: 2,
  },
  {
    question: "Ai là anh hùng áo vải của Bình Định?",
    options: [
      "A. Trần Quang Diệu",
      "B. Nguyễn Huệ",
      "C. Nguyễn Ánh",
      "D. Phan Đình Phùng",
    ],
    answer: 1,
  },
  {
    question: "Biển nào nổi tiếng ở Bình Định?",
    options: [
      "A. Biển Nha Trang",
      "B. Biển Quy Nhơn",
      "C. Biển Vũng Tàu",
      "D. Biển Cửa Lò",
    ],
    answer: 1,
  },
  {
    question: "Lễ hội nào đặc sắc ở Gia Lai?",
    options: [
      "A. Lễ hội Cồng chiêng",
      "B. Lễ hội Chùa Hương",
      "C. Lễ hội Lim",
      "D. Lễ hội Gò Đống Đa",
    ],
    answer: 0,
  },
  {
    question: "Dân tộc nào sinh sống nhiều ở Gia Lai?",
    options: ["A. Kinh", "B. Ê Đê", "C. Ba Na", "D. Khmer"],
    answer: 2,
  },
  {
    question: "Tỉnh lỵ của Bình Định là thành phố nào?",
    options: ["A. Tuy Hòa", "B. Quy Nhơn", "C. Đồng Hới", "D. Tam Kỳ"],
    answer: 1,
  },
  {
    question: "Gia Lai tiếp giáp quốc gia nào?",
    options: ["A. Trung Quốc", "B. Campuchia", "C. Lào", "D. Thái Lan"],
    answer: 2,
  },
  {
    question: "Chùa Ông Núi nổi tiếng thuộc tỉnh nào?",
    options: ["A. Gia Lai", "B. Đắk Lắk", "C. Bình Định", "D. Kon Tum"],
    answer: 2,
  },
  {
    question: 'Món "bánh ít lá gai" là đặc sản của tỉnh nào?',
    options: ["A. Gia Lai", "B. Phú Yên", "C. Bình Định", "D. Đắk Nông"],
    answer: 2,
  },
  {
    question: "Tỉnh nào có địa danh Tây Sơn?",
    options: ["A. Bình Định", "B. Gia Lai", "C. Quảng Ngãi", "D. Kon Tum"],
    answer: 0,
  },
];

export default function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index) => {
    if (index === questions[current].answer) {
      setScore(score + 1);
    }
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const shareOnFacebook = () => {
    const shareText = `Tôi vừa hoàn thành quiz \"Gia Lai & Bình Định\" với số điểm ${score}/${questions.length}! Bạn có dám thử?`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=https://your-quiz-url.com&quote=${encodeURIComponent(
      shareText
    )}`;
    window.open(fbUrl, "_blank");
  };

  const progress = ((current / questions.length) * 100).toFixed(0);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl text-[var(--color-secondary)] mb-6 text-center "
      >
        Dân Gia Lai chính hiệu liệu có vượt qua được 15 câu hỏi này?
      </motion.h1>

      <div className="w-full h-2 bg-[var(--color-secondary)]/50  overflow-hidden mb-4">
        <div
          className="h-full bg-[var(--color-secondary)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <AnimatePresence mode="wait">
        {showResult ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="text-center">
                <h2 className="text-xl font-semibold text-[var(--color-red)]">
                  Kết quả của bạn: {score} / {questions.length}
                </h2>
                {score >= 12 ? (
                  <p className="text-green-600 mt-4 text-lg font-bold animate-bounce">
                    Chúc mừng bạn là cư dân Gia Lai!
                  </p>
                ) : (
                  <p className="text-[var(--color-red)] mt-4 text-lg">
                    Bạn cần tìm hiểu thêm nhé!
                  </p>
                )}
                <Button
                  className="mt-6 bg-[var(--color-red)]  hover:bg-[var(--color-red)]/80"
                  onClick={shareOnFacebook}
                >
                  Chia sẻ kết quả lên Facebook
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent>
                <h2 className="font-semibold mb-4 text-lg text-[var(--color-red)]">
                  Câu {current + 1}: {questions[current].question}
                </h2>
                <div className="flex flex-col gap-3">
                  {questions[current].options.map((opt, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="text-left"
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
