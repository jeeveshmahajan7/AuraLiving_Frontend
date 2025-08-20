import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const FavoriteButton = ({ isInitiallyFavorite, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !isFavorite;
    setIsFavorite(newState);

    onToggle(); // parent will update the backend
  };

  return (
    <button
      className="favorite-btn"
      onClick={handleClick}
      aria-label={`${isFavorite} ? Remove from favorites : Add to favorites`}
    >
      {isFavorite ? (
        <AiFillHeart color="red" size={20} />
      ) : (
        <AiOutlineHeart color="black" size={20} />
      )}
    </button>
  );
};

export default FavoriteButton;
