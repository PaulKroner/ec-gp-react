/**
 * Context and provider for managing authentication and user roles in the application.
 * This context provides the authentication status, user role, and login/logout functions to the entire application.
 * It also manages the loading state while checking for an existing authentication token in localStorage.
 * 
 * @typedef {Object} AuthContext
 * @property {number|string} userRole - The role of the authenticated user (Admin, User).
 * @property {boolean} isAuthenticated - Whether the user is authenticated.
 * @property {boolean} loading - Whether the authentication check is in progress.
 * @property {function} login - Function to log in a user and store their authentication token.
 * @property {function} logout - Function to log out a user and clear the authentication token.
*/

import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

export const UserRole = {
  "Admin": 1,
  "User": 2,
}

// Create a context with default values
export const AuthContext = createContext({
  userRole: '',
  setUserRole: () => { },
  isAuthenticated: false,
  login: () => { },
  logout: () => { },
  loading: true,
});

// Provider component
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);  // New state to track if the app is loading
  const timeoutRef = useRef(null); // Reference for the inactivity timer

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Token exists, assume the user is authenticated
      setIsAuthenticated(true);
      // We won't decode the token, just store it
      // You can also use the role_id from API response here if needed (during login)
    } else {
      setIsAuthenticated(false);
      setUserRole('');
    }
    setLoading(false);
  }, []);

  const login = (token, roleId) => {
    // Store token in localStorage
    localStorage.setItem('token', token);
  
    // Directly set the role from API response (since we can't decode it)
    setUserRole(roleId);
    setIsAuthenticated(true);
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    setUserRole('');
    setIsAuthenticated(false);
  };

  // const resetTimer = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }
  //   // Set a new timeout for 10 seconds
  //   timeoutRef.current = setTimeout(() => {
  //     logout(); // Call logout after 5 minutes of inactivity
  //   }, 300000);
  // };

  // useEffect(() => {
  //   // Event listeners for detecting user activity
  //   const events = ['mousemove', 'keydown', 'click'];
  //   events.forEach(event => window.addEventListener(event, resetTimer));

  //   return () => {
  //     // Cleanup event listeners on unmount
  //     events.forEach(event => window.removeEventListener(event, resetTimer));
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current); // Clear timeout on unmount
  //     }
  //   };
  // }, [resetTimer]);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider")
  }
  return context;
}