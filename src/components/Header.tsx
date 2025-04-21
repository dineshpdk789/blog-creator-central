
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { checkAuth, login, logout } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    setIsAdmin(checkAuth());
  }, []);

  const handleLoginClick = () => {
    if (isAdmin) {
      return;
    }
    const password = prompt("Enter admin password:");
    if (password) {
      const success = login(password);
      if (success) {
        setIsAdmin(true);
        toast({
          title: "Success!",
          description: "You are now logged in as admin.",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Incorrect password.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogoutClick = () => {
    logout();
    setIsAdmin(false);
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <header className="border-b border-blog-border bg-white dark:bg-background sticky top-0 z-10 transition-colors">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-blog-primary tracking-tight dark:text-primary">BloggerClone</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-700 dark:text-gray-100 hover:text-blog-primary dark:hover:text-blog-primary transition-colors">
            Home
          </Link>
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-gray-700 dark:text-gray-100 hover:text-blog-primary dark:hover:text-blog-primary transition-colors">
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                className="border-blog-primary text-blog-primary hover:bg-blog-primary hover:text-white"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="border-blog-primary text-blog-primary hover:bg-blog-primary hover:text-white"
              onClick={handleLoginClick}
            >
              Admin
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
