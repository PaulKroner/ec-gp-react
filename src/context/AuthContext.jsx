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
import { jwtDecode } from 'jwt-decode';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // New state to track if the app is loading
  const timeoutRef = useRef(null); // Reference for the inactivity timer

  useEffect(() => {
    const token = localStorage.getItem('token');
    const roleId = localStorage.getItem("roleId");

    const checkAuthentication = () => {
      if (token) {
          setIsAuthenticated(true);
          setUserRole(roleId ? Number(roleId) : ''); // Convert roleId to number
        }
       else {
        setIsAuthenticated(false);
        setUserRole('');
        console.log("hier stimmt doch auch was nicht")
      }
    };

    checkAuthentication();
    setLoading(false);
  }, []);


  const login = (token) => {
    // Store token and expiration time in localStorage
    const decodedToken = jwtDecode(token);
    localStorage.setItem('token', token);
    localStorage.setItem('roleId', decodedToken.role_id); // Store roleId

    setUserRole(decodedToken.role_id);
    setIsAuthenticated(true);
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roleId');
    setUserRole('');
    setIsAuthenticated(false);
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout for 10 seconds
    timeoutRef.current = setTimeout(() => {
      logout(); // Call logout after 5 minutes of inactivity
    }, 300000);
  };

  useEffect(() => {
    // Event listeners for detecting user activity
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      // Cleanup event listeners on unmount
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout on unmount
      }
    };
  }, [resetTimer]);

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