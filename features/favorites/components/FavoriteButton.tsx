"use client";

import { useFavoriteStore } from "../stores/useFavoriteStore";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  coinId: string;
}

export default function FavoriteButton({ coinId }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const favorite = isFavorite(coinId);

  const handleClick = () => {
    if (favorite) {
      removeFavorite(coinId);
      toast.success("Successfully deleted!");
    } else {
      addFavorite(coinId);
      toast.success("Successfully added!");
    }
  };

  return (
    <button onClick={handleClick} className="text-2xl hover:scale-110 transition-transform" aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
      {favorite ? "★" : "☆"}
    </button>
  );
}
