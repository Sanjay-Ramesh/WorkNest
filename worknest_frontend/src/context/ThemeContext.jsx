import { createContext, useState } from "react";

export const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);
    
}