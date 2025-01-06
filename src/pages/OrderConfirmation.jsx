import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const { cart, address, deliveryTime, paymentMethod, email, isGuestOrder } =
    location.state || {};

  if (!cart || !address || !deliveryTime || !email) {
    return <p>No order details found. Something went wrong!</p>;
  }

  const DELIVERY_FEE = 3.99;
  const subtotalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalPrice = subtotalPrice + DELIVERY_FEE;

  return (
    <div className="mt-[150px] p-4 max-w-[1400px] mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-2 text-center text-green-600">
          Thank you for your order!
        </h2>

        <p className="text-center text-gray-600 mb-8">
          A confirmation email will be sent to {email} shortly
        </p>

        {isGuestOrder && (
          <div className="mb-8 p-4 bg-blue-50 text-blue-700 rounded-lg">
            <p>
              Want to track your order history?
              <Link to="/login?register=true" className="underline ml-1">
                Create an account
              </Link>
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Order Details - Left Side */}
          <div className="md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Order Details
              </h3>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="font-medium">Delivery to:</span>
                  <span className="text-gray-600">{address}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Expected by:</span>
                  <span className="text-gray-600">{deliveryTime}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <span className="text-gray-600">
                    {paymentMethod === "payNow"
                      ? "Paid Online"
                      : "Cash on delivery"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-600">{email}</span>
                </p>
                {location.state.notes && (
                  <div className="border-t pt-3">
                    <p className="font-medium mb-1">Order Notes:</p>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {location.state.notes}
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t space-y-2">
                  <p className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>€{subtotalPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between text-gray-600">
                    <span>Delivery Fee:</span>
                    <span>€{DELIVERY_FEE.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between text-lg font-semibold text-green-600 pt-2 border-t">
                    <span>Total:</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items - Right Side */}
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Order Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      Toppings:{" "}
                      {Object.entries(item.toppings)
                        .filter(([_, value]) => value > 0)
                        .map(([key]) => key)
                        .join(", ") || "None"}
                    </p>
                    <p className="text-green-600 font-semibold">
                      €{item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
