
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // UseEffect to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    console.log("Theme Toggle mounted, current theme:", theme);
  }, [theme]);

  // Force a re-render when the theme changes
  useEffect(() => {
    // This ensures our component re-renders when theme changes
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      console.log("Adding dark class to HTML element");
    } else {
      htmlElement.classList.remove('dark');
      console.log("Removing dark class from HTML element");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Toggling theme from", theme, "to", newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    // Return a placeholder with same dimensions to avoid layout shift
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className="!ml-2">
        <div className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost" 
      size="icon" 
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="!ml-2"
    >
      {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};

export default ThemeToggle;
