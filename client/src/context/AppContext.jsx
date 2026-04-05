import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext(null);

const doctors = [
    {
        _id: "doc-1",
        name: "Dr. Amelia Carter",
        speciality: "Cardiologist",
        degree: "MBBS, MD",
        experience: "12 Years",
        about: "Experienced in preventive cardiology, cardiac imaging, and long-term heart health management.",
        fee: 800,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
    },
    {
        _id: "doc-2",
        name: "Dr. Ethan Brooks",
        speciality: "Dermatologist",
        degree: "MBBS, DDVL",
        experience: "9 Years",
        about: "Focuses on clinical dermatology, acne management, and non-invasive skin treatment plans.",
        fee: 650,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
    },
    {
        _id: "doc-3",
        name: "Dr. Sophia Nguyen",
        speciality: "Neurologist",
        degree: "MBBS, DM",
        experience: "14 Years",
        about: "Treats migraines, seizure disorders, and complex neurological conditions with patient-first care.",
        fee: 1000,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80"
    },
    {
        _id: "doc-4",
        name: "Dr. Mason Patel",
        speciality: "Pediatrician",
        degree: "MBBS, DCH",
        experience: "10 Years",
        about: "Provides routine child wellness care, immunization guidance, and family-centered pediatric support.",
        fee: 500,
        image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80"
    }
];

const hospitals = [
    {
        name: "Sunrise Medical Center",
        location: "Bengaluru, Karnataka",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
    },
    {
        name: "Green Valley Hospital",
        location: "Hyderabad, Telangana",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80"
    },
    {
        name: "CityCare Multispeciality",
        location: "Chennai, Tamil Nadu",
        image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=900&q=80"
    }
];

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem('token') || "");
    const [userData, setUserData] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState("");
    const currencySymbol = "Rs. ";

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

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: {
                    token: userToken,
                    Authorization: `Bearer ${userToken}`
                },
                signal
            });

            if (data.success) {
                setUserData(data.userData);
                setProfileError("");
                return data.userData;
            }

            setUserData(false);
            setProfileError(data.message || "Unable to load profile data.");
            return null;
        } catch (error) {
            if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
                return null;
            }

            console.error("Profile Fetch Error:", error.message);

            if (error.response?.status === 401) {
                setUserData(false);
                setProfileError(error.response?.data?.message || "Your profile could not be loaded. Please log in again.");
                return null;
            }

            if (error.response?.data?.message) {
                setProfileError(error.response.data.message);
                return null;
            }

            setProfileError("Unable to load profile data right now.");
            return null;
        } finally {
            if (!signal?.aborted) {
                setIsProfileLoading(false);
            }
        }
    }, [backendUrl, token]);

    useEffect(() => {
        const controller = new AbortController();

        if (token) {
            loadUserProfileData(token, controller.signal);
        } else {
            setUserData(false);
        }

        return () => controller.abort();
    }, [token, loadUserProfileData]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            setProfileError("");
            setIsProfileLoading(false);
        }
    }, [token]);

    const value = {
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        isProfileLoading,
        profileError,
        loadUserProfileData,
        doctors,
        hospitals,
        currencySymbol
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
