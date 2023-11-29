import { createContext, useState } from 'react';
export const themeContext = createContext({});
export default function useTheme() {
  const [theme, setTheme] = useState('light');

  function changeTheme(value) {
    setTheme(value);
  }
  return {
    theme,
    changeTheme
  };
}
