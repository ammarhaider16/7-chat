import { createContext, useState, useContext } from "react";

// Create the context with default values
const UserContext = createContext({
  userID: null,
  email: null,
  setUserID: () => {},
  setEmail: () => {},
});

// Define the UserProvider component
export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState(null); // Manage userID state
  const [email, setEmail] = useState(null); // Manage email state

  return (
    <UserContext.Provider value={{ userID, setUserID, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
