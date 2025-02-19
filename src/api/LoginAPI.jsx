import axiosInstanceAPI from "./axiosInstanceAPI";

export const handleLogin = async (event, email, password, setLoading, login, toast, navigate) => {
  event.preventDefault();
  setLoading(true); // Show loading spinner

  try {
    const res = await axiosInstanceAPI.post('/login/login.php', { email, password });

    // Ensure response is valid and contains a token
    if (res.status === 200 && res.data.token) {
      const token = res.data.token;
      localStorage.setItem('token', token);

      login(token); // Store JWT properly

      navigate("/dashboard");

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

    if (error.response.status === 401) {
      toast({
        variant: "destructive",
        description: error.response.data.message || "Falsche Zugangsdaten.",
      });
    } else if (error.message.includes("Network Error")) {
      toast({
        variant: "destructive",
        description: "Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung.",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut. " + error.message,
      });
    }
  } finally {
    setLoading(false); // Hide loading spinner
  }
};
