import axiosInstanceAPI from "./axiosInstanceAPI";

export const InsertEmployee = async (transformedFormData, toast, setLoading) => {
  setLoading(true);

  alert(transformedFormData.vorname);

  try {
    const response = await axiosInstanceAPI.post('/insertEmployee.php', transformedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if fz_eingetragen is empty before sending the email
    if (transformedFormData.fz_eingetragen === null) {
      await axiosInstanceAPI.post('/sendEmailRequestFZ.php', {
        email: transformedFormData.email,
        name: transformedFormData.name,
        vorname: transformedFormData.vorname
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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