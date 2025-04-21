
// In a real app, this would be connected to a secure authentication system
// For now, this is a simple mock implementation

let isAuthenticated = false;

export const login = (password: string): boolean => {
  // In a real app, this would validate against a secure backend
  // For demo purposes, we're using a simple password check
  if (password === "admin123") {
    isAuthenticated = true;
    localStorage.setItem("isAdmin", "true");
    // Set timestamp to check for session expiration
    localStorage.setItem("authTimestamp", Date.now().toString());
    return true;
  }
  return false;
};

export const logout = (): void => {
  isAuthenticated = false;
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("authTimestamp");
};

export const checkAuth = (): boolean => {
  const storedAuth = localStorage.getItem("isAdmin");
  const timestamp = localStorage.getItem("authTimestamp");
  
  // Check if auth has expired (24 hours)
  if (timestamp && Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
    logout();
    return false;
  }
  
  isAuthenticated = storedAuth === "true";
  return isAuthenticated;
};
