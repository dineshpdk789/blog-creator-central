
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
  }, []);

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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="!ml-2"
    >
      {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};

export default ThemeToggle;
