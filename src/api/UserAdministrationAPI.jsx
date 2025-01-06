import axios from 'axios';

// Function to get users from the backend
export const getDataRoles = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/getDataRoles');
    return response.data; // Return the fetched data
  } catch (error) {
    return null; // Return null or handle the error appropriately
  }
};

export const deleteUserFromDB = async (id, toast, data, setData) => {
  try {
    await axios.delete(`http://localhost:8080/api/deleteUser/${id}`);
    setData(data.filter(employee => employee.id !== id));
    toast({
      description: "Mitarbeiter wurde erfolgreich gelöscht.",
    });
  } catch (error) {
    if (error.response) {
      // Server-side error
      toast({
        variant: "destructive",
        description: 'Fehler beim Löschen des Mitarbeiters: ' + error.message,
      });
    } else {
      // Other error (e.g., network issue)
      toast({
        variant: "destructive",
        description: "Anderer Fehler beim Löschen des Mitarbeiters: " + error.message,
      });
    }
  }
};

export const updateUser = async (id, formData, setLoading, setData, toast, getDataRoles) => {
  setLoading(true);
  try {
    const response = await axios.put(`http://localhost:8080/api/updateUser/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const updatedData = await getDataRoles(); //display the updated users
      setData(updatedData);
      toast({
        description: "User erfolgreich aktualisiert.",
      });
      setLoading(false);
    }
  } catch (error) {
    toast({
      variant: "destructive",
      description: 'Fehler bei Update des Users: ' + error.message,
    });
  }
  setLoading(false);
};