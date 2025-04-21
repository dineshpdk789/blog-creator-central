
// In a real app, this would be connected to a secure authentication system
// For now, this is a simple mock implementation

let isAuthenticated = false;

export const login = (password: string): boolean => {
  // In a real app, this would validate against a secure backend
  // For demo purposes, we're using a simple password check
  if (password === "admin123") {
    isAuthenticated = true;
    localStorage.setItem("isAdmin", "true");
    return true;
  }
  return false;
};

export const logout = (): void => {
  isAuthenticated = false;
  localStorage.removeItem("isAdmin");
};

export const checkAuth = (): boolean => {
  const storedAuth = localStorage.getItem("isAdmin");
  isAuthenticated = storedAuth === "true";
  return isAuthenticated;
};
