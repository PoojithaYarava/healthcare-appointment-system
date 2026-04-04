import { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') || false);
    const [userData, setUserData] = useState(false);

    // 1. We wrap the fetch logic in useCallback. 
    // This makes the function 'static' unless token or backendUrl changes.
    const loadUserProfileData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { 
                headers: { token } 
            });
            
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }, [backendUrl, token]);

    // 2. Now the effect is 'safe' because it depends on a stable function.
    useEffect(() => {
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token, loadUserProfileData]);

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;