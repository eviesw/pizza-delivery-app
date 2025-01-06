import { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Listen for auth state changes and load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load user's orders when they log in or page refreshes
        const userOrders = localStorage.getItem(`orders_${currentUser.uid}`);
        if (userOrders) {
          setOrders(JSON.parse(userOrders));
        }
        // Load favorites (existing code)
        const userFavorites = localStorage.getItem(
          `favorites_${currentUser.uid}`
        );
        if (userFavorites) {
          setFavorites(JSON.parse(userFavorites));
        }
      } else {
        // Clear data when user logs out
        setOrders([]);
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`orders_${user.uid}`, JSON.stringify(orders));
    }
  }, [orders, user]);

  // Save favorites whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err) {
      let errorMessage = "An error occurred";
      if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      throw new Error(errorMessage);
    }
  };

  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      return userCredential.user;
    } catch (err) {
      let errorMessage = "An error occurred";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFavorites([]); // Clear favorites from state
      // No need to remove from localStorage as it's user-specific
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addOrder = async (orderData) => {
    if (!user) return;

    try {
      const orderWithMetadata = {
        ...orderData,
        userId: user.uid,
        userEmail: user.email,
        orderId: Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Add new order to the beginning of the array
      setOrders((prevOrders) => [orderWithMetadata, ...prevOrders]);

      // Immediately save to localStorage
      localStorage.setItem(
        `orders_${user.uid}`,
        JSON.stringify([orderWithMetadata, ...orders])
      );

      return orderWithMetadata.orderId;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  };

  const addToFavorites = (item) => {
    if (!user) return;

    setFavorites((prev) => {
      // Check if item is already in favorites using both id and type
      const isDuplicate = prev.some(
        (fav) => fav.id === item.id && fav.type === item.type
      );
      if (isDuplicate) return prev;

      const newFavorites = [
        ...prev,
        {
          ...item,
          favoriteId: Date.now(),
          type: item.type || "pizza", // Add type if not present
        },
      ];

      // Save to localStorage immediately
      if (user) {
        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(newFavorites)
        );
      }

      return newFavorites;
    });
  };

  const removeFromFavorites = (favoriteId) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((fav) => fav.favoriteId !== favoriteId);

      // Save to localStorage immediately
      if (user) {
        localStorage.setItem(
          `favorites_${user.uid}`,
          JSON.stringify(newFavorites)
        );
      }

      return newFavorites;
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    orders,
    addOrder,
    favorites,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
