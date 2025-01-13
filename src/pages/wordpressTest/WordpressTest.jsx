import React, { useEffect, useState } from "react";
import axios from "axios";

const WordPressTest = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/wordpress/index.php/wp-json/react-api/v1/getdata")
      .then((response) => {
        setData(response.data);
        console.log(response.data); // Check if data is received
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>WordPress Daten</h1>
      {error ? (
        <p>Fehler: {error}</p>
      ) : (
        <ul>
          {data.map((user) => (
            <li key={user.ID}>
              <strong>{user.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordPressTest;