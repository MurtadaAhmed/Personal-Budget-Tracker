import React, {useEffect, useState} from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import TransactionList from "./components/TransactionList";
import AddTransaction from "./components/AddTransaction";
import EditTransaction from "./components/EditTransaction";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken)
        }
    }, []);


  if (!token) {
    return (
        <div>
          <Login setToken={setToken}/>
          <Register />
        </div>
    );
  }

  const handleLogout = () => {
      localStorage.removeItem('token');
      setToken(null);
  }

  return (
      <div>
      <h1>Welcome to Personal Budget Tracker</h1>
          <button onClick={handleLogout}>Logout</button>

          {editingTransaction ? (
              <EditTransaction
                  token={token}
                  transaction={editingTransaction}
                  onUpdate={() => {
                      setEditingTransaction(null);
                      setRefreshKey((prev) => prev +1)
                  }}
              />
          ) : (
              <>
              <AddTransaction
                  token={token}
                  onAdd={() => {setRefreshKey((prev) => prev +1 )}}
              />
              <TransactionList
              key={refreshKey}
              token={token}
              onEdit={setEditingTransaction}

              />
              </>
          )
          }
      </div>
  );
};

export default App;