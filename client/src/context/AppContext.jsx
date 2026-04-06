import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "./appContextInstance";

export { AppContext } from "./appContextInstance";

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [authRole, setAuthRole] = useState(() => localStorage.getItem("authRole") || (localStorage.getItem("token") ? "user" : ""));
    const [userData, setUserData] = useState(false);
    const [doctorData, setDoctorData] = useState(false);
    const [adminData, setAdminData] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [labTests, setLabTests] = useState([]);
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

    const loadLabTests = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/data/lab-tests`);
            if (data.success) {
                setLabTests(data.labTests);
            }
        } catch (error) {
            console.error("Lab Tests Fetch Error:", error.message);
        }
    }, [backendUrl]);

    const loadAuthProfileData = useCallback(async (sessionToken = token, role = authRole, signal) => {
        if (!sessionToken || !role) {
            setUserData(false);
            setDoctorData(false);
            setAdminData(false);
            setProfileError("");
            setIsProfileLoading(false);
            return null;
        }

        try {
            setIsProfileLoading(true);
            setProfileError("");

            const endpoint = role === "doctor"
                ? "/api/doctor/get-profile"
                : role === "admin"
                    ? "/api/admin/profile"
                    : "/api/user/get-profile";

            const { data } = await axios.get(`${backendUrl}${endpoint}`, {
                headers: authHeaders(sessionToken),
                signal
            });

            if (data.success) {
                if (role === "admin") {
                    setAdminData(data.admin);
                    setUserData(false);
                    setDoctorData(false);
                    return data.admin;
                }

                if (role === "doctor") {
                    setDoctorData(data.doctor);
                    setUserData(false);
                    setAdminData(false);
                    return data.doctor;
                }

                setUserData(data.userData);
                setDoctorData(false);
                setAdminData(false);
                return data.userData;
            }

            setUserData(false);
            setDoctorData(false);
            setAdminData(false);
            setProfileError(data.message || "Unable to load profile data.");
            return null;
        } catch (error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return null;
            }

            console.error("Profile Fetch Error:", error.message);
            setUserData(false);
            setDoctorData(false);
            setAdminData(false);
            setProfileError(error.response?.data?.message || "Unable to load profile data right now.");
            return null;
        } finally {
            if (!signal?.aborted) {
                setIsProfileLoading(false);
            }
        }
    }, [authHeaders, authRole, backendUrl, token]);

    useEffect(() => {
        loadDoctors();
        loadHospitals();
        loadLabTests();
    }, [loadDoctors, loadHospitals, loadLabTests]);

    useEffect(() => {
        const controller = new AbortController();

        if (token && authRole) {
            loadAuthProfileData(token, authRole, controller.signal);
        } else {
            setUserData(false);
            setDoctorData(false);
            setAdminData(false);
            setProfileError("");
            setIsProfileLoading(false);
        }

        return () => controller.abort();
    }, [authRole, token, loadAuthProfileData]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    useEffect(() => {
        if (authRole) {
            localStorage.setItem("authRole", authRole);
        } else {
            localStorage.removeItem("authRole");
        }
    }, [authRole]);

    const clearSession = useCallback(() => {
        setToken("");
        setAuthRole("");
        setUserData(false);
        setDoctorData(false);
        setAdminData(false);
        setProfileError("");
    }, []);

    const value = {
        token,
        setToken,
        authRole,
        setAuthRole,
        backendUrl,
        authHeaders,
        userData,
        setUserData,
        doctorData,
        setDoctorData,
        adminData,
        setAdminData,
        isProfileLoading,
        profileError,
        loadAuthProfileData,
        clearSession,
        doctors,
        hospitals,
        labTests,
        isDataLoading,
        loadDoctors,
        loadHospitals,
        loadLabTests,
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
