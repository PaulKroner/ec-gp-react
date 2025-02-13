import axiosInstanceAPI from "./axiosInstanceAPI";

export const InsertEmployee = async (transformedFormData, toast, setLoading) => {
  setLoading(true);

  try {
    const response = await axiosInstanceAPI.post('/dashboard/insertEmployee.php', transformedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if fz_eingetragen is empty before sending the email
    if (transformedFormData.fz_eingetragen === null) {
      try {
        await axiosInstanceAPI.post('/sendEmailRequestFZ.php', {
          email: transformedFormData.email,
          name: transformedFormData.name,
          vorname: transformedFormData.vorname
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        toast({
          description: "E-Mail zur Führungszeugnis-Anforderung erfolgreich gesendet.",
        });

      } catch (emailError) {
        const errorMessage = emailError.response?.data?.message || "Fehler beim Senden der E-Mail.";
        toast({
          variant: "destructive",
          description: errorMessage,
        });
      }
    }

    window.location = `${process.env.REACT_APP_BASE_URL}/dashboard`; // workaround to refresh the page
    toast({
      description: "Neuen Mitarbeiter erfolgreich hinzugefügt.",
    });
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response?.data?.message
      // Server-side error
      toast({
        variant: "destructive",
        description: 'Fehler beim Hinzufügen des Mitarbeiters: ' + errorMessage,
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