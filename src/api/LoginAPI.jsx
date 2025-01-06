import axios from "axios";
import axiosInstance from "./axiosInstance";

export const handleLogin = async (event, email, password, setLoading, login, toast, navigate) => {
  event.preventDefault();
  setLoading(true); // show loading spinner

  try {
    const res = await axiosInstance.post('/login', {
      email, password
    });

    if (res.status === 200) { // successful login
      const token = res.data.token; // Get the token from the response

      // Save the token in localStorage
      localStorage.setItem('token', token);

      // Use the context's login function to update role and authentication status
      login(token);

      // Redirect to the next page
      navigate("/dashboard");
      toast({
        description: "Login war erfolgreich!",
      });
    }
  } catch (error) {
    if (error.response) {
      // login failed or other server error
      toast({
        variant: "destructive",
        description: error.response.data.message || 'Login fehlgeschlagen',
      });
    } else {
      // something else failed
      toast({
        variant: "destructive",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut: das Backend ist nicht erreichbar.",
      });
    }
  }
  setLoading(false);
};