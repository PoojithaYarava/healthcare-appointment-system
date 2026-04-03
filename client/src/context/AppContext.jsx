import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') || false);
    
    const backendUrl = "http://localhost:4000";

    const value = {
        token, 
        setToken,
        backendUrl
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;