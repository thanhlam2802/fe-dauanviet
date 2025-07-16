import AnimatedCard from "./AnimatedCard";

const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE;
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  return `${BACKEND_DOMAIN}${path}`;
};

function CultureCard({ card, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(card); // ✅ Gọi hàm được truyền từ cha
  };

  return (
    <AnimatedCard onClick={handleClick}>
      <div>
        <img
          className="card-img"
          src={getImageUrl(card.imageURL)}
          alt={card.name}
        />
        <div className="card-text">{card.name}</div>
      </div>
    </AnimatedCard>
  );
}

export default CultureCard;
