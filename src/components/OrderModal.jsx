import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function OrderModal({ onClose, onPlaceOrder, cart }) {
  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    postcode: "",
    phone: "",
    email: "",
  });
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState("payNow"); // Default to 'payNow'
  const [deliveryOption, setDeliveryOption] = useState("now"); // Default to 'now'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add an onChange handler to switch between "now" and "scheduled"
  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
    // If switching to "scheduled", ensure deliveryTime is valid
    if (option === "scheduled" && !deliveryTime) {
      setDeliveryTime(new Date()); // Default to current date if not already set
    }
  };

  // Handle submitting the order
  const handleSubmit = () => {
    const { fullName, street, city, postcode, phone, email } = formData;

    // Validate required fields
    if (
      !fullName ||
      !street ||
      !city ||
      !postcode ||
      !phone ||
      !email ||
      !deliveryTime
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Format the delivery time based on the option
    const finalDeliveryTime =
      deliveryOption === "now"
        ? "As soon as possible"
        : deliveryTime.toLocaleString();

    // Create the order details object
    const orderDetails = {
      address: `${street}, ${city}, ${postcode}`,
      email: email,
      deliveryTime: finalDeliveryTime,
      paymentMethod,
    };

    // Pass the order details to the parent component
    onPlaceOrder(orderDetails);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white p-6 rounded-md w-full max-w-[800px] z-[1001]">
        <h3 className="text-3xl font-semibold">Order Details</h3>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block font-medium">Full Name*:</label>
            <input
              type="text"
              name="fullName"
              className="border p-2 w-full"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          {/* Street */}
          <div>
            <label className="block font-medium">Street*:</label>
            <input
              type="text"
              name="street"
              className="border p-2 w-full"
              value={formData.street}
              onChange={handleInputChange}
            />
          </div>

          {/* City and Postcode on the same line */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium">City*:</label>
              <input
                type="text"
                name="city"
                className="border p-2 w-full"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Postcode*:</label>
              <input
                type="text"
                name="postcode"
                className="border p-2 w-full"
                value={formData.postcode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Phone Number and Email on the same line */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium">Phone Number*:</label>
              <input
                type="text"
                name="phone"
                className="border p-2 w-full"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium">Email*:</label>
              <input
                type="email"
                name="email"
                className="border p-2 w-full"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Payment method options */}
        <div className="mt-4">
          <label className="block">Payment Method:</label>
          <div>
            <label>
              <input
                type="radio"
                value="payNow"
                checked={paymentMethod === "payNow"}
                onChange={() => setPaymentMethod("payNow")}
              />
              Pay Now
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="payCash"
                checked={paymentMethod === "payCash"}
                onChange={() => setPaymentMethod("payCash")}
              />
              Pay Cash
            </label>
          </div>
        </div>

        {/* Delivery time options */}
        <div className="mt-4">
          <label className="block">Delivery Option:</label>
          <div>
            <label>
              <input
                type="radio"
                value="now"
                checked={deliveryOption === "now"}
                onChange={() => handleDeliveryOptionChange("now")}
              />
              Order Now
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="scheduled"
                checked={deliveryOption === "scheduled"}
                onChange={() => handleDeliveryOptionChange("scheduled")}
              />
              Schedule for Later
            </label>
          </div>
        </div>

        {deliveryOption === "scheduled" && (
          <div className="mt-4">
            <label className="block">Choose Delivery Date and Time:</label>
            <DatePicker
              selected={deliveryTime || new Date()}
              onChange={(date) => setDeliveryTime(date)}
              showTimeSelect
              timeIntervals={15}
              minDate={new Date()}
              minTime={new Date(0, 0, 0, 12, 0)}
              maxTime={new Date(0, 0, 0, 22, 0)}
              filterTime={(time) => {
                const hours = time.getHours();
                const minutes = time.getMinutes();
                const isToday =
                  deliveryTime?.toDateString() === new Date().toDateString();

                // Get current time plus 2 hours
                const currentDate = new Date();
                const minTime = new Date(
                  currentDate.getTime() + 2 * 60 * 60 * 1000
                );
                const minHour = minTime.getHours();
                const minMinutes = minTime.getMinutes();

                // If it's today, ensure time is at least 2 hours from now
                if (isToday) {
                  if (
                    hours < minHour ||
                    (hours === minHour && minutes < minMinutes)
                  ) {
                    return false;
                  }
                }

                // Regular hour restriction (12-22)
                return hours >= 12 && hours <= 22;
              }}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="border p-2 w-full"
              placeholderText="Select delivery time (min. 2 hours from now)"
            />
            <p className="text-sm text-gray-600 mt-1">
              For same-day orders less than 2 hours from now, please choose
              "Order Now" option
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
