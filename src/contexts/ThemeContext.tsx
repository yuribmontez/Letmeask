import { createContext, ReactNode, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextProviderProps = {
    children: ReactNode;
}

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const storagedTheme = localStorage.getItem('theme')

        if (storagedTheme === 'dark') {
            document.body.classList.add('dark')
        }
        
        return (storagedTheme ?? 'light') as Theme;
    });

    useEffect(() =>{
        localStorage.setItem('theme', currentTheme)
    },[currentTheme])

    function toggleTheme() {
        setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
        currentTheme === 'light' ? document.body.classList.add('dark') : document.body.classList.remove('dark')
    }

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}