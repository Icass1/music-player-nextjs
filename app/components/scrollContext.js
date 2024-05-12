'use client';

import React, { createContext, useState, useEffect } from 'react';

const ScrollContext = createContext();

const ScrollProvider = ({ children }) => {
    const [scrollValue, setScrollValue] = useState(0);
  
    return (
        <ScrollContext.Provider value={{
            scrollValue,
            setScrollValue,
        }}>
            {children}
        </ScrollContext.Provider>
    );
};

export { ScrollContext, ScrollProvider };
