// import { data } from "autoprefixer";
import axios from "axios";

export const handleRegistration = async (event, email, password, role, name, vorname, toast, setLoading, navigate) => {
  event.preventDefault();
  const lowerCaseEmail = email.trim().toLowerCase();
  setLoading(true);

  if (!role) {
    toast({
      variant: "destructive",
      description: "Bitte wählen Sie eine Rolle",
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/register', {
      email: lowerCaseEmail, password, role, name, vorname
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      // Successful registration
      toast({
        description: "Registrierung war erfolgreich!",
      });
      navigate("/dashboard")
    } else {
      // Handle errors
      toast({
        variant: "destructive",
        description: "Registrierung fehlgeschlagen: " + response.data.message,
      });
    }
  } catch (error) {
    // something else failed
    toast({
      variant: "destructive",
      description: "Ein anderer Fehler ist aufgetreten: das Backend ist nicht verfügbar.",
    });
  }
  setLoading(false);
};

export const handleResetPassword = async (event, checkAccordance, token, password, toast, navigate, setLoading ) => {
  event.preventDefault();
  setLoading(true); // show loading spinner
  try {
    checkAccordance(); // throw error if passwords don't match
    const res = await axios.post('http://localhost:8080/api/resetPassword', {
      token, // use the token from the URL
      newPassword: password,
    });

    if (res.status === 200) {
      toast({
        description: "Passwort zurücksetzen war erfolgreich!",
      });
      // router.push("/"); // redirect to homepage
      navigate("/");
    }
  } catch (error) {
    if (error.message === "Passwords do not match") {
      toast({
        variant: "destructive",
        description: "Die Passwörter stimmen nicht überein.",
      });
    } else if (error.response) {
      toast({
        variant: "destructive",
        description: 'Passwort zurücksetzen fehlgeschlagen: ' + error.response.data,
      });
    } else {
      toast({
        variant: "destructive",
        description: "Ein anderer Fehler ist aufgetreten: Backend ist nicht verfügbar.",
      });
    }
  } finally {
    setLoading(false);
  }
};

export const handleResetRequest = async (event, email, toast, setLoading) => {
  event.preventDefault();
  setLoading(true);
  await axios.post('http://localhost:8080/api/sendResetPasswordEmail', {
    email,
  });
  toast({
    description: "Anfrage ist abgeschickt. Bitte überprüfen Sie Ihre E-Mails!",
  });
  setLoading(false);
};