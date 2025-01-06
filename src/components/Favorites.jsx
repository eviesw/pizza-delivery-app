import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import { FaHeart, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Favorites() {
  const { favorites, removeFromFavorites, user } = useUser();
  const { addToCart } = useCart();
  const [addedToCartId, setAddedToCartId] = useState(null);

  const handleAddToCart = (item) => {
    const cartItem = {
      ...item,
      quantity: item.quantity || 1,
      toppings: item.toppings || {},
      totalPrice: item.totalPrice || item.price,
    };

    addToCart(cartItem);
    toast.success("Added to cart!", {
      duration: 2000,
      icon: <FaShoppingCart color="white" size={24} />,
    });
  };

  const handleRemoveFromFavorites = (favoriteId) => {
    removeFromFavorites(favoriteId);
    toast.success("Removed from favorites", {
      duration: 2000,
      icon: <FaRegHeart color="#ff6347" size={24} />,
      style: {
        background: "white",
        color: "#ff6347",
        padding: "16px",
        boxShadow:
          "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        fontSize: "1.1rem",
        borderRadius: "10px",
        border: "1px solid #ff6347",
      },
    });
  };

  return (
    <div className="mt-6 w-full max-w-[1400px] mx-auto px-4">
      <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
        Your Favorites <FaHeart className="text-[#ff6347]" />
      </h3>

      {!favorites || favorites.length === 0 ? (
        <p className="text-center text-gray-500">
          No favorites yet. Add some pizzas to your favorites!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((item) => (
            <div
              key={item.favoriteId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Pizza Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />

              {/* Content Container */}
              <div className="p-4">
                <h4 className="font-bold text-xl mb-2">{item.name}</h4>

                {/* Toppings */}
                {item.type === "pizza" && item.toppings && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Extra Toppings: </span>
                    {Object.entries(item.toppings)
                      .filter(([_, value]) => value > 0)
                      .map(([key]) => key)
                      .join(", ") || "None"}
                  </p>
                )}

                {/* Price */}
                <p className="text-lg font-bold text-green-600 mb-4">
                  €{(item.totalPrice || item.price).toFixed(2)}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="text-sm" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromFavorites(item.favoriteId)}
                    className="p-2 text-[#ff6347] hover:text-[#ff4f2b] transition-colors duration-300"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Notification */}
              {addedToCartId === item.favoriteId && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
                  Added to Cart! 🛒
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
