import React, { useEffect, useState } from 'react';
import { FaPalette } from 'react-icons/fa';

const themes = {
  default: `
    --primary: #c14dd4;
    --primary-hover: rgb(179, 74, 184);
    --secondary: #2f0ca1;
    --tertiary: #2a9bc0;
    --spotify: #1DB954;
    --background: #1f1e1e;
    --player-background: #282828;
    --page-background: #2b2b2b;
    --text-color: #fff;
    --link-color: #5d5d5d;
    --body-color: #5d5d5d;
    --black: #000;
    --white: #fff;
    --dark-highlight: #321437;
  `,
  darkBlue: `
    --primary: #2980b9;
    --primary-hover: rgb(41, 128, 185);
    --secondary: #8e44ad;
    --tertiary: #27ae60;
    --spotify: #1DB954;
    --background: #121212;
    --player-background: #1c1c1c;
    --page-background: #1a1a1a;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #3498db;
    --black: #000;
    --white: #fff;
    --dark-highlight: #0a2342;
  `,
  darkGreen: `
    --primary: #27ae60;
    --primary-hover: rgb(39, 174, 96);
    --secondary: #16a085;
    --tertiary: #e67e22;
    --spotify: #1DB954;
    --background: #181818;
    --player-background: #1c1c1c;
    --page-background: #141414;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #2ecc71;
    --black: #000;
    --white: #fff;
    --dark-highlight: #113d2f;
  `,
  darkRed: `
    --primary: #c0392b;
    --primary-hover: rgb(192, 57, 43);
    --secondary: #8e44ad;
    --tertiary: #d35400;
    --spotify: #1DB954;
    --background: #1f1f1f;
    --player-background: #272727;
    --page-background: #1a1a1a;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #e74c3c;
    --black: #000;
    --white: #fff;
    --dark-highlight: #331a1a;
  `,
  darkOrange: `
    --primary: #d35400;
    --primary-hover: rgb(211, 84, 0);
    --secondary: #c0392b;
    --tertiary: #e67e22;
    --spotify: #1DB954;
    --background: #1b1b1b;
    --player-background: #2c2c2c;
    --page-background: #222222;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #e67e22;
    --black: #000;
    --white: #fff;
    --dark-highlight: #331a1a;
  `,
  darkTeal: `
    --primary: #008080;
    --primary-hover: rgb(0, 128, 128);
    --secondary: #005757;
    --tertiary: #20b2aa;
    --spotify: #1DB954;
    --background: #1a1a1a;
    --player-background: #1c1c1c;
    --page-background: #141414;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #2e8b57;
    --black: #000;
    --white: #fff;
    --dark-highlight: #004d4d;
  `,
  darkPink: `
    --primary: #ff1493;
    --primary-hover: rgb(255, 20, 147);
    --secondary: #c71585;
    --tertiary: #ff69b4;
    --spotify: #1DB954;
    --background: #1f1e1e;
    --player-background: #2c2c2c;
    --page-background: #252525;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #ff69b4;
    --black: #000;
    --white: #fff;
    --dark-highlight: #8b008b;
  `,
  darkYellow: `
    --primary: #ffd700;
    --primary-hover: rgb(255, 215, 0);
    --secondary: #ffb400;
    --tertiary: #ff8c00;
    --spotify: #1DB954;
    --background: #1a1a1a;
    --player-background: #2c2c2c;
    --page-background: #141414;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #ffb400;
    --black: #000;
    --white: #fff;
    --dark-highlight: #8b8000;
  `,
  darkCyan: `
    --primary: #00ced1;
    --primary-hover: rgb(0, 206, 209);
    --secondary: #008b8b;
    --tertiary: #20b2aa;
    --spotify: #1DB954;
    --background: #1e1e1e;
    --player-background: #2a2a2a;
    --page-background: #1b1b1b;
    --text-color: #ecf0f1;
    --link-color: #5d5d5d;
    --body-color: #00ced1;
    --black: #000;
    --white: #fff;
    --dark-highlight: #006a6a;
  `,
};

type ThemeKey = keyof typeof themes;

const ThemeSwapper: React.FC = () => {
  const [theme, setTheme] = useState<ThemeKey>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeKey | null;
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
      const root = document.documentElement;
      root.style.cssText = themes[savedTheme];
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value as ThemeKey;
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    const root = document.documentElement;
    root.style.cssText = themes[selectedTheme];
  };

  return (
    <div className='select-container'>
      <FaPalette className='select-icon' />
      <select id="theme-select" className='theme-select' value={theme} onChange={handleChange}>
        <option value="default">Default Theme</option>
        <option value="darkBlue">Dark Blue</option>
        <option value="darkGreen">Dark Green</option>
        <option value="darkRed">Dark Red</option>
        <option value="darkOrange">Dark Orange</option>
        <option value="darkTeal">Dark Teal</option>
        <option value="darkPink">Dark Pink</option>
        <option value="darkYellow">Dark Yellow</option>
        <option value="darkCyan">Dark Cyan</option>
      </select>
    </div>
  );
};

export default ThemeSwapper;
