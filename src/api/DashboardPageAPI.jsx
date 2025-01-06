import axios from "axios";

export const InsertEmployee = async (transformedFormData, toast, setLoading) => {
  setLoading(true);
  
  try {
    const response = await axios.post('http://localhost:8080/api/create', transformedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if fz_eingetragen is empty before sending the email
    if (transformedFormData.fz_eingetragen === null) {
      await axios.post('http://localhost:8080/api/sendEmailRequestFZ', {
        email: transformedFormData.email,
        name: transformedFormData.name
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Email sent to " + transformedFormData.email);
    }

    window.location = "/dashboard"; // workaround to refresh the page
    toast({
      description: "Neuen Mitarbeiter erfolgreich hinzugefügt.",
    });
  } catch (error) {
    if (error.response) {
      // Server-side error
      toast({
        variant: "destructive",
        description: 'Fehler beim Hinzufügen des Mitarbeiters: ' + error.message,
      });
    } else {
      // Other error (e.g., network)
      toast({
        variant: "destructive",
        description: "Anderer Fehler beim Hinzufügen des Mitarbeiters: Backend ist nicht verfügbar.",
      });
    }
  }
  
  setLoading(false);
};