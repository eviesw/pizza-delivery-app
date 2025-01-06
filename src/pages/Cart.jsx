import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-hot-toast";

export default function Cart() {
  const { cart, setCart, cartNotes, setCartNotes } = useCart();
  const navigate = useNavigate();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { user, addOrder } = useUser();

  const DELIVERY_FEE = 3.99;

  const subtotalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const overallTotalPrice = subtotalPrice + DELIVERY_FEE;

  // Function to remove an item from the cart
  const removeItemFromCart = (indexToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((_, index) => index !== indexToRemove)
    );
  };

  // onPlaceOrder function to handle order submission
  const onPlaceOrder = async (orderDetails) => {
    try {
      const orderData = {
        cart: [...cart],
        ...orderDetails,
        notes: cartNotes,
        deliveryFee: DELIVERY_FEE,
        subtotalPrice: subtotalPrice,
        totalPrice: overallTotalPrice,
        status: "completed",
        createdAt: new Date().toISOString(),
        isGuestOrder: !user,
      };

      // If user is logged in, save to their order history
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

  return (
    <div className="mt-[150px] p-4">
      <h2 className="text-2xl font-semibold mb-4">YOUR CART</h2>
      {cart.length === 0 ? (
        <p>No items in the cart. Add some pizzas from the menu!</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} className="border p-4 mb-4 shadow-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className=" text-xl font-bold">{item.name}</h3>
              <p className="text-slate-700">{item.description}</p>
              <p className="mt-2">Quantity: {item.quantity}</p>
              <p>
                Extra Toppings:{" "}
                {Object.entries(item.toppings)
                  .filter(([_, value]) => value > 0)
                  .map(([key]) => key)
                  .join(", ") || "None"}
              </p>
              <p className="font-semibold mt-2">
                Total Price: €{item.totalPrice.toFixed(2)}{" "}
                {/* Use totalPrice here */}
              </p>
              {/* Remove button */}
              <button
                onClick={() => removeItemFromCart(index)}
                className="mt-2 bg-[#ff6347] text-white p-2 rounded hover:bg-[#ff4f2b]"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 mb-4">
            <label
              htmlFor="orderNotes"
              className="block text-lg font-medium mb-2"
            >
              Order Notes
            </label>
            <textarea
              id="orderNotes"
              value={cartNotes}
              onChange={(e) => setCartNotes(e.target.value)}
              placeholder="Add any special instructions or notes for your order..."
              className="w-full p-3 border rounded-md min-h-[100px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="mt-4 p-4 border-t">
            <h3 className="text-xl font-semibold mb-2">
              Subtotal: €{subtotalPrice.toFixed(2)}
            </h3>
            <h3 className="text-xl font-semibold mb-2">
              Delivery Fee: €{DELIVERY_FEE.toFixed(2)}
            </h3>
            <h3 className="text-xl font-semibold text-green-600">
              Total Price: €{overallTotalPrice.toFixed(2)}
            </h3>
          </div>

          {/* Place Order Button */}
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {user ? "Place Order" : "Place Order as Guest"}
          </button>
        </div>
      )}

      {isOrderModalOpen && (
        <OrderModal
          onClose={() => setIsOrderModalOpen(false)}
          onPlaceOrder={onPlaceOrder}
        />
      )}
    </div>
  );
}
