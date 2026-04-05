import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [userData, setUserData] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const currencySymbol = "Rs. ";

    const authHeaders = useCallback((authToken = token) => ({
        token: authToken,
        Authorization: `Bearer ${authToken}`
    }), [token]);

    const loadDoctors = useCallback(async () => {
        try {
            setIsDataLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/data/doctors`);
            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.error("Doctors Fetch Error:", error.message);
        } finally {
            setIsDataLoading(false);
        }
    }, [backendUrl]);

    const loadHospitals = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/data/hospitals`);
            if (data.success) {
                setHospitals(data.hospitals);
            }
        } catch (error) {
            console.error("Hospitals Fetch Error:", error.message);
        }
    }, [backendUrl]);

    const loadUserProfileData = useCallback(async (userToken = token, signal) => {
        if (!userToken) {
            setUserData(false);
            setProfileError("");
            setIsProfileLoading(false);
            return null;
        }

        try {
            setIsProfileLoading(true);
            setProfileError("");

            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: authHeaders(userToken),
                signal
            });

            if (data.success) {
                setUserData(data.userData);
                return data.userData;
            }

            setUserData(false);
            setProfileError(data.message || "Unable to load profile data.");
            return null;
        } catch (error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return null;
            }

            console.error("Profile Fetch Error:", error.message);
            setUserData(false);
            setProfileError(error.response?.data?.message || "Unable to load profile data right now.");
            return null;
        } finally {
            if (!signal?.aborted) {
                setIsProfileLoading(false);
            }
        }
    }, [authHeaders, backendUrl, token]);

    useEffect(() => {
        loadDoctors();
        loadHospitals();
    }, [loadDoctors, loadHospitals]);

    useEffect(() => {
        const controller = new AbortController();

        if (token) {
            loadUserProfileData(token, controller.signal);
        } else {
            setUserData(false);
            setProfileError("");
            setIsProfileLoading(false);
        }

        return () => controller.abort();
    }, [token, loadUserProfileData]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const value = {
        token,
        setToken,
        backendUrl,
        authHeaders,
        userData,
        setUserData,
        isProfileLoading,
        profileError,
        loadUserProfileData,
        doctors,
        hospitals,
        isDataLoading,
        loadDoctors,
        loadHospitals,
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
