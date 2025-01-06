import { useUser } from "../contexts/UserContext";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

export default function OrderHistory() {
  const { orders = [] } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Calculate pagination values
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-6 w-full max-w-[1400px] mx-auto px-4">
      <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
        Order History <FaHistory className="text-blue-500" />
      </h3>

      {!orders || orders.length === 0 ? (
        <p className="text-center text-gray-500">No order history found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.orderId} className="border p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">
                      Order Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Delivery Address:</span>{" "}
                      {order.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Delivery Time:</span>{" "}
                      {order.deliveryTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.paymentMethod === "payNow"
                        ? "Online payment"
                        : "Cash on delivery"}
                    </p>
                  </div>
                  <p className="font-bold text-lg">
                    Total: €{order.totalPrice.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Items:</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {order.cart.map((item, idx) => (
                      <div key={idx} className="border p-2 rounded">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Quantity:</span>{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Toppings:</span>{" "}
                          {Object.entries(item.toppings)
                            .filter(([_, value]) => value > 0)
                            .map(([key]) => key)
                            .join(", ") || "None"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Price:</span> €
                          {item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "text-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
