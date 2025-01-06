import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import OrderConfirmation from "./pages/OrderConfirmation";
import styled from "styled-components";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppContainer>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#22c55e", // green-500 color code
                  color: "white",
                  padding: "16px",
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#22c55e", // green-500 color code
                },
              },
              error: {
                style: {
                  background: "#ff6347", // Changed to tomato
                  color: "white",
                  padding: "16px",
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
                  fontSize: "1.1rem",
                  borderRadius: "10px",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "#ff6347", // Changed to tomato
                },
              },
            }}
          />
          <Navbar />
          <Routes className="items-center">
            <Route path="/" element={<Menu />} />
            <Route path="login" element={<Login />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
          </Routes>
          <Footer />
        </AppContainer>
      </CartProvider>
    </UserProvider>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;
