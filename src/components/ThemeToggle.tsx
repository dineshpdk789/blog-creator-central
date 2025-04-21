
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="!ml-2"
    >
      {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;
