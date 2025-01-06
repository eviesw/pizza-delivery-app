import Modal from "../components/Modal";
import OrderModal from "../components/OrderModal";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MenuNav from "../components/MenuNav";
import { pizzas, burgers, drinks, desserts, extras } from "../data/menuItems";
import { useInView } from "react-intersection-observer";

export default function Menu() {
  const navigate = useNavigate();
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [customToppings, setCustomToppings] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { cart, setCart, addToCart, cartNotes, setCartNotes } = useCart();
  const { user, addToFavorites, favorites, addOrder, removeFromFavorites } =
    useUser();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const DELIVERY_FEE = 3.99;

  const subtotalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const overallTotalPrice = subtotalPrice + DELIVERY_FEE;

  const removeItemFromCart = (indexToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((_, index) => index !== indexToRemove)
    );
  };

  const toppings = [
    { name: "Extra Cheese", price: 1.5 },
    { name: "Pepperoni", price: 2.0 },
    { name: "Mushrooms", price: 1.0 },
    { name: "Olives", price: 1.2 },
    { name: "Bacon", price: 2.5 },
    { name: "Pineapple", price: 1.99 },
  ];

  const openModal = (item, category) => {
    setSelectedPizza({
      ...item,
      category: category,
    });
    setIsModalOpen(true);
    setCustomToppings({});
    setQuantity(1);
  };

  const toggleTopping = (toppingName, toppingPrice) => {
    setCustomToppings((prev) => {
      const isAdding = !prev[toppingName];
      return {
        ...prev,
        [toppingName]: isAdding ? toppingPrice : 0,
      };
    });
  };

  const calculateTotalPrice = () => {
    const toppingsTotal = Object.values(customToppings).reduce(
      (sum, price) => sum + price,
      0
    );
    return (selectedPizza.price + toppingsTotal) * quantity;
  };

  const handleAddToCart = (customizedPizza) => {
    const pizzaWithToppings = {
      ...customizedPizza,
      quantity: quantity,
      toppings: customToppings,
      totalPrice:
        (customizedPizza.price +
          Object.entries(customToppings).reduce(
            (acc, [key, value]) =>
              acc + value * toppings.find((t) => t.name === key).price,
            0
          )) *
        quantity,
    };

    addToCart(pizzaWithToppings);
    setIsModalOpen(false);
    setCustomToppings({});
    setQuantity(1);
    toast.success("Added to cart!", {
      icon: <FaShoppingCart color="white" size={24} />,
    });
  };

  const handleAddToFavorites = (item, category) => {
    const itemWithType = {
      ...item,
      type: category,
    };
    addToFavorites(itemWithType);
  };

  const handleFavoriteClick = (item, itemType) => {
    if (!user) {
      toast.error("Please login to add favorites", {
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
      navigate("/login");
      return;
    }

    const existingFavorite = favorites.find(
      (fav) => fav.id === item.id && fav.type === itemType
    );

    if (existingFavorite) {
      removeFromFavorites(existingFavorite.favoriteId);
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
    } else {
      handleAddToFavorites(item, itemType);
      toast.success("Added to favorites!", {
        duration: 2000,
        icon: <FaHeart color="#ff6347" size={24} />,
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
    }
  };

  const isFavorite = (itemId, itemType) => {
    if (!favorites || !user) return false;
    return favorites.some((fav) => fav.id === itemId && fav.type === itemType);
  };

  const handlePlaceOrder = async (orderDetails) => {
    try {
      const orderData = {
        cart: [...cart],
        ...orderDetails,
        deliveryFee: DELIVERY_FEE,
        subtotalPrice: subtotalPrice,
        totalPrice: overallTotalPrice,
        status: "completed",
        createdAt: new Date().toISOString(),
        isGuestOrder: !user,
      };

      if (user) {
        await addOrder(orderData);
      }

      setCart([]);
      setIsOrderModalOpen(false);
      navigate("/order-confirmation", { state: orderData });
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Helper function to render a menu section
  const renderMenuSection = (items, title, id, isLastSection = false) => {
    const { ref, inView } = useInView({
      threshold: 0,
      triggerOnce: true,
    });

    return (
      <section
        ref={ref}
        id={id}
        className="mt-16 border-t border-gray-200 pt-16"
      >
        {inView ? (
          <>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
              {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative flex flex-col"
                >
                  <img
                    loading="lazy"
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-lg font-bold text-green-600 mb-4">
                      €{item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => openModal(item, id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                      <button
                        onClick={() => handleFavoriteClick(item, id)}
                        className={`p-2 rounded-md transition-colors duration-300 ${
                          isFavorite(item.id, id)
                            ? "text-[#ff6347] hover:text-[#ff4f2b]"
                            : "text-gray-400 hover:text-[#ff6347]"
                        }`}
                        aria-label={
                          isFavorite(item.id, id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {isFavorite(item.id, id) ? (
                          <FaHeart size={24} />
                        ) : (
                          <FaRegHeart size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ height: "500px" }} /> // Placeholder
        )}
      </section>
    );
  };

  // Helper function to determine item category
  const determineCategory = (item) => {
    if (pizzas.find((p) => p.id === item.id)) return "pizza";
    if (burgers.find((b) => b.id === item.id)) return "burger";
    if (drinks.find((d) => d.id === item.id)) return "drink";
    if (desserts.find((d) => d.id === item.id)) return "dessert";
    if (extras.find((e) => e.id === item.id)) return "extra";
    return "other";
  };

  return (
    <>
      <MenuNav />
      <div className="mt-[120px]">
        <div className="flex">
          {/* Main content */}
          <div className="w-full lg:w-[75%] px-4 md:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
              <section id="pizzas">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-8">
                  OUR PIZZAS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pizzas.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative flex flex-col"
                    >
                      <img
                        loading="lazy"
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <p className="text-lg font-bold text-green-600 mb-4">
                          €{item.price.toFixed(2)}
                        </p>
                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={() => openModal(item, "pizza")}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart /> Add to Cart
                          </button>
                          <button
                            onClick={() => handleFavoriteClick(item, "pizza")}
                            className={`p-2 rounded-md transition-colors duration-300 ${
                              isFavorite(item.id, "pizza")
                                ? "text-[#ff6347] hover:text-[#ff4f2b]"
                                : "text-gray-400 hover:text-[#ff6347]"
                            }`}
                            aria-label={
                              isFavorite(item.id, "pizza")
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            {isFavorite(item.id, "pizza") ? (
                              <FaHeart size={24} />
                            ) : (
                              <FaRegHeart size={24} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {renderMenuSection(burgers, "BURGERS", "burgers")}
              {renderMenuSection(extras, "EXTRAS", "extras")}
              {renderMenuSection(drinks, "DRINKS", "drinks")}
              {renderMenuSection(desserts, "DESSERTS", "desserts", true)}
            </div>
          </div>

          {/* Desktop Cart Aside */}
          <aside className="hidden lg:block w-[25%] h-[calc(100vh-120px)] bg-white shadow-lg p-4 sticky top-[120px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">YOUR CART</h2>
            {cart.length === 0 ? (
              <p>No items in the cart. Add some pizzas!</p>
            ) : (
              <div>
                {cart.map((item, index) => (
                  <div key={index} className="border-b pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">
                          Extra Toppings:{" "}
                          {Object.entries(item.toppings)
                            .filter(([_, value]) => value > 0)
                            .map(([key]) => key)
                            .join(", ") || "None"}
                        </p>
                        <p className="font-semibold">
                          €{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItemFromCart(index)}
                        className="text-[#ff6347] hover:text-[#ff4f2b]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Notes Section */}
                <div className="mt-4 mb-4">
                  <label
                    htmlFor="desktopOrderNotes"
                    className="block text-sm font-medium mb-2"
                  >
                    Order Notes
                  </label>
                  <textarea
                    id="desktopOrderNotes"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                    placeholder="Add any special instructions..."
                    className="w-full p-2 border rounded-md min-h-[80px] text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>€{subtotalPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Delivery Fee:</span>
                    <span>€{DELIVERY_FEE.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between font-bold text-green-600">
                    <span>Total:</span>
                    <span>€{overallTotalPrice.toFixed(2)}</span>
                  </p>
                </div>

                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Place Order
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Cart Button */}
      <button
        onClick={() => setIsMobileCartOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-[40] flex items-center gap-2"
      >
        <FaShoppingCart />
        <span className="font-semibold">{cart.length}</span>
      </button>

      {/* Mobile Cart Slide-in Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[60] ${
          isMobileCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">YOUR CART</h2>
            <button
              onClick={() => setIsMobileCartOpen(false)}
              className="text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p>No items in the cart. Add some pizzas!</p>
            ) : (
              <div>
                {cart.map((item, index) => (
                  <div key={index} className="border-b pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">
                          Extra Toppings:{" "}
                          {Object.entries(item.toppings)
                            .filter(([_, value]) => value > 0)
                            .map(([key]) => key)
                            .join(", ") || "None"}
                        </p>
                        <p className="font-semibold">
                          €{item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItemFromCart(index)}
                        className="text-[#ff6347] hover:text-[#ff4f2b]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Notes Section */}
                <div className="mt-4 mb-4">
                  <label
                    htmlFor="mobileOrderNotes"
                    className="block text-sm font-medium mb-2"
                  >
                    Order Notes
                  </label>
                  <textarea
                    id="mobileOrderNotes"
                    value={cartNotes}
                    onChange={(e) => setCartNotes(e.target.value)}
                    placeholder="Add any special instructions..."
                    className="w-full p-2 border rounded-md min-h-[80px] text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>€{subtotalPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Delivery Fee:</span>
                    <span>€{DELIVERY_FEE.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between font-bold text-green-600">
                    <span>Total:</span>
                    <span>€{overallTotalPrice.toFixed(2)}</span>
                  </p>
                </div>

                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile cart */}
      {isMobileCartOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[50]"
          onClick={() => setIsMobileCartOpen(false)}
        />
      )}

      {/* OrderModal - ensure it's outside both desktop and mobile cart */}
      {isOrderModalOpen && (
        <OrderModal
          onClose={() => {
            setIsOrderModalOpen(false);
            setIsMobileCartOpen(false); // Close mobile cart when order modal opens
          }}
          onPlaceOrder={handlePlaceOrder}
          cart={cart}
        />
      )}

      {/* Add the Modal component */}
      {isModalOpen && selectedPizza && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col">
            {/* Image at the top */}
            <img
              src={selectedPizza.image}
              alt={selectedPizza.name}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />

            {/* Only show toppings for pizzas */}
            {selectedPizza.category === "pizza" && (
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold mb-2">Extra Toppings</h3>
                {toppings.map((topping) => (
                  <div key={topping.name} className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customToppings[topping.name] > 0}
                        onChange={() =>
                          setCustomToppings((prev) => ({
                            ...prev,
                            [topping.name]: prev[topping.name] ? 0 : 1,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span>
                        {topping.name} (+€{topping.price.toFixed(2)})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Pizza details */}
            <h2 className="text-2xl font-bold mb-2">{selectedPizza.name}</h2>
            <p className="text-gray-600 mb-2">{selectedPizza.description}</p>
            <p className="text-xl font-bold text-green-600 mb-4">
              €{selectedPizza.price.toFixed(2)}
            </p>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart and Favorite buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(selectedPizza)}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add to Cart - €
                {(
                  (selectedPizza.price +
                    Object.entries(customToppings).reduce(
                      (acc, [key, value]) =>
                        acc +
                        value * toppings.find((t) => t.name === key).price,
                      0
                    )) *
                  quantity
                ).toFixed(2)}
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Please login to add favorites", {
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
                    navigate("/login");
                    return;
                  }
                  if (isFavorite(selectedPizza.id, selectedPizza.category)) {
                    const favoriteToRemove = favorites.find(
                      (fav) =>
                        fav.id === selectedPizza.id &&
                        fav.type === selectedPizza.category
                    );
                    removeFromFavorites(favoriteToRemove.favoriteId);
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
                  } else {
                    handleAddToFavorites(selectedPizza, selectedPizza.category);
                    toast.success("Added to favorites!", {
                      duration: 2000,
                      icon: <FaHeart color="#ff6347" size={24} />,
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
                  }
                }}
                className={`px-4 py-2 rounded transition-colors duration-300 ${
                  isFavorite(selectedPizza.id, selectedPizza.category)
                    ? "bg-[#ff6347] text-white hover:bg-[#ff4f2b]"
                    : "border border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347] hover:text-white"
                }`}
              >
                {isFavorite(selectedPizza.id, selectedPizza.category) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
