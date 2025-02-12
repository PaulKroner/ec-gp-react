import axiosInstanceAPI from "./axiosInstanceAPI";

export const handleLogin = async (event, email, password, setLoading, login, toast, navigate) => {
  event.preventDefault();
  setLoading(true); // Show loading spinner

  try {
    const res = await axiosInstanceAPI.post('/login/login.php', { email, password });

    console.log('API Response:', res.data);

    // Ensure response is valid and contains a token
    if (res.status === 200 && res.data.token) {
      const token = res.data.token;
      localStorage.setItem('token', token);

      login(token); // Store JWT properly
      
      // Redirect to the dashboard
      navigate("/dashboard");

      // Show success message
      toast({
        description: "Login war erfolgreich!",
      });
    } else {
      // Prevent success message when token is null
      toast({
        variant: "destructive",
        description: "Login fehlgeschlagen: " + res.data.message,
      });
      throw new Error(res.data.message || "Login fehlgeschlagen");

    }
  } catch (error) {
    console.error("Login Fehler:", error.response?.status, error.response?.data || error.message);

    if (error.response) {
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Login fehlgeschlagen",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      });
    }
  } finally {
    setLoading(false); // Hide loading spinner
  }
};
