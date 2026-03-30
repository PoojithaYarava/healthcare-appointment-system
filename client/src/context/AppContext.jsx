import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';

    // Fake Database for Doctors
   // Inside src/context/AppContext.jsx

const [doctors] = useState([
    { 
        _id: 'doc1', 
        name: 'Dr. Sarah Jenkins', 
        speciality: 'General Physician', 
        // Using a reliable medical portrait URL
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400', 
        fee: 50 
    },
    { 
        _id: 'doc2', 
        name: 'Dr. Richard James', 
        speciality: 'Dermatologist', 
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400', 
        fee: 60 
    }
]);

const [hospitals] = useState([
    { 
        _id: 'h1', 
        name: 'MediConnect Central', 
        location: 'Downtown', 
        // Using a reliable modern building URL
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600',
        verified: true
    }
]);

    const value = {
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