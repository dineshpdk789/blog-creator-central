
import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-blog-muted border-t border-blog-border mt-16">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Dinesh Blogs</h3>
            <p className="text-gray-600">
              A simple blogging by Dinesh .
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
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blog-primary transition-colors">
                  About
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
         
          <div className="container mx-auto text-center">
        <div className="social-icons flex justify-center items-center space-x-4">
          <a href="https://www.linkedin.com/in/dineshpdk789/" target="_blank" rel="noopener noreferrer">
            <img src='public\linkedin.png' className="w-6 h-6 text-blue-500 hover:text-blue-700" />
          </a>
          <a href="https://www.instagram.com/dineshpdk789/" target="_blank" rel="noopener noreferrer">
            <img src='public\instagram.png' className="w-6 h-6 text-pink-500 hover:text-pink-700" />
          </a>
          <a href="https://github.com/Dinupdk/" target="_blank" rel="noopener noreferrer">
            <img src='public\github.png' className="w-6 h-6 text-pink-500 hover:text-pink-700" />
          </a>
          <a href="https://x.com/Dineshpdk789/" target="_blank" rel="noopener noreferrer">
            <img src='public\twitter.png' className="w-6 h-6 text-pink-500 hover:text-pink-700" />
          </a>
          <a href="mailto:dineshpdk7893@gmail.com" target="_blank" rel="noopener noreferrer">
            <img src='public\gmail.png' className="w-6 h-6 text-pink-500 hover:text-pink-700" />
          </a>


        </div>
       
      </div>
            
         
        </div>
        
        <div className="border-t border-blog-border mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {year} Dinesh Blogs. All rights reserved.</p>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;

