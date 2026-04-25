import React, { createContext, useContext, useState } from 'react';

interface EasterEggContextType {
  triggerEasterEgg: () => void;
  isVisible: boolean;
  closeEasterEgg: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export const EasterEggProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const triggerEasterEgg = () => {
    setIsVisible(true);
  };

  const closeEasterEgg = () => {
    setIsVisible(false);
  };

  return (
    <EasterEggContext.Provider value={{ triggerEasterEgg, isVisible, closeEasterEgg }}>
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEgg must be used within EasterEggProvider');
  }
  return context;
};
