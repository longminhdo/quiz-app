
import React, { createContext, useMemo, useState, useContext } from 'react';

const ModalContext = createContext({});

ModalContext.displayName = 'ModalContext';

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const valueObject = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <ModalContext.Provider value={valueObject}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;