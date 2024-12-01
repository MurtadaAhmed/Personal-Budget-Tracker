import React, {useState} from "react";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return (
        <div>
          <Login setToken={setToken}/>
          <Register />
        </div>
    );
  }

  return (
      <div>
      <h1>Welcome to Personal Budget Tracker</h1>
      </div>
  );
};

export default App;