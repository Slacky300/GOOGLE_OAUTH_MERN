import { createContext, useContext, useState } from 'react';

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [activeForm, setActiveForm] = useState(1);

  const triggerUpdate = () => {
    setShouldUpdate(prev => !prev);
  };


  return (
    <UpdateContext.Provider value={{ shouldUpdate, triggerUpdate, loading, setLoading, selectedUser, setSelectedUser, activeForm, setActiveForm }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);