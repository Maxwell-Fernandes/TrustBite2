import { UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

// Logo component
const Logo = () => (
  <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
    TrustBite
  </Link>
);

// Authentication buttons component
const AuthButtons = () => (
  <div className="flex gap-2">
    <Link 
      to="/sign-in" 
      className="px-4 py-2 bg-white text-emerald-600 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
    >
      Sign In
    </Link>
    <Link 
      to="/sign-up" 
      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-sm"
    >
      Sign Up
    </Link>
  </div>
);

// Mobile menu component
const MobileMenu = ({ isOpen, setIsOpen }) => (
  <div className="md:hidden">
    <button 
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
    
    {isOpen && (
      <div className="absolute top-16 left-0 right-0 bg-white shadow-lg rounded-b-lg z-50">
        <div className="p-4 flex flex-col gap-4">
          <Link 
            to="/" 
            className="px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/submit" 
            className="px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Submit Report
          </Link>
          <Link 
            to="/status" 
            className="px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            My Reports
          </Link>
        </div>
      </div>
    )}
  </div>
);

// Navigation links component
const NavigationLinks = () => (
  <div className="hidden md:flex items-center gap-6">
    <Link to="/" className="text-white hover:text-emerald-100 transition-colors">
      Home
    </Link>
    <Link to="/submit" className="text-white hover:text-emerald-100 transition-colors">
      Submit Report
    </Link>
    <Link to="/status" className="text-white hover:text-emerald-100 transition-colors">
      My Reports
    </Link>
  </div>
);

// Main Header component
function Header() {
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-6">
          <Logo />
          <NavigationLinks />
        </div>
        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "border-2 border-white"
                }
              }} 
            />
          ) : (
            <div className="hidden md:block">
              <AuthButtons />
            </div>
          )}
          
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen} 
          />
        </div>
      </div>
      
      {/* Mobile auth buttons (when not signed in) */}
      {!isSignedIn && isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-white shadow-inner">
          <AuthButtons />
        </div>
      )}
    </header>
  );
}

export default Header;