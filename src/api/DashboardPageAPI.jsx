import axiosInstanceAPI from "./axiosInstanceAPI";

export const InsertEmployee = async (transformedFormData, toast, setLoading) => {
  setLoading(true);

  try {
    const response = await axiosInstanceAPI.post('/dashboard/insertEmployee.php', transformedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check before sending the email
    const sendEmailRequest = async (endpoint, successMessage) => {
      try {
        await axiosInstanceAPI.post(endpoint, {
          email: transformedFormData.email,
          name: transformedFormData.name,
          vorname: transformedFormData.vorname
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
    
        toast({ description: successMessage });
      } catch (emailError) {
        toast({
          variant: "destructive",
          description: emailError.response?.data?.message || "Fehler beim Senden der E-Mail.",
        });
      }
    };
    
    if (transformedFormData.fz_eingetragen === null) {
      await sendEmailRequest('/sendEmailRequestFZ.php', 
        "E-Mail zur Führungszeugnis-Anforderung erfolgreich gesendet.");
    }
    
    if (transformedFormData.sve_eingetragen === null) {
      await sendEmailRequest('/SendEmailRequestSVE.php', 
        "E-Mail zur Selbstverpflichtungserklärung-Anforderung erfolgreich gesendet.");
    }

    window.location = `/dashboard`; // workaround to refresh the page -> problem: toast does not get rendered correctly
    toast({
      description: "Neuen Mitarbeiter erfolgreich hinzugefügt.",
    });
  } catch (error) {
    if (error.response) {
      toast({
        variant: "destructive",
        description: 'Fehler beim Hinzufügen des Mitarbeiters: ' + error.response?.data?.message,
      });
    } else {
      toast({
        variant: "destructive",
        description: "Anderer Fehler beim Hinzufügen des Mitarbeiters: Backend ist nicht verfügbar.",
      });
    }
  }
  
  setLoading(false);
};