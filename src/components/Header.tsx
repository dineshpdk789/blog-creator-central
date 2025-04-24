
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="border-b dark:border-gray-800 py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blog-primary">
          Dinesh Blogs 
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin Dashboard</Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Admin Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
