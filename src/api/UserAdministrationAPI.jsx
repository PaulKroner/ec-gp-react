import axiosInstanceAPI from './axiosInstanceAPI';

// Function to get users from the backend
export const getDataRoles = async () => {
  try {
    const response = await axiosInstanceAPI.get('/getUserData.php');
    return response.data; // Return the fetched data
  } catch (error) {
    return null; // Return null or handle the error appropriately
  }
};

export const deleteUserFromDB = async (id, toast, data, setData) => {
  try {
    await axiosInstanceAPI.delete(`/deleteUser.php?id=${id}`);
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
    const response = await axiosInstanceAPI.post(`/updateUser.php`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: { id }, // id wird als Parameter übergeben
    });

    console.log(formData);

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