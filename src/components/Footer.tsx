
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-blog-muted border-t border-blog-border mt-16">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">BloggerClone</h3>
            <p className="text-gray-600">
              A simple blogging platform inspired by Google Blogger.
              Share your thoughts with the world.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blog-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-blog-primary transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blog-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blog-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blog-border mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {year} BloggerClone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
