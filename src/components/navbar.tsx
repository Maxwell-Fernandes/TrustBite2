import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Bell, X, AlertTriangle, ListChecks, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "admin@foodsafewatch.com";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
                TrustBite
              </span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/submit" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Submit Report
            </Link>
            <Link to="/status" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              My Reports
            </Link>
            {isAdmin && (
              <Link to="/admin" className="px-3 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            {isSignedIn && (
              <div className="flex items-center ml-4">
                <img 
                  src={user?.imageUrl || "/api/placeholder/32/32"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-3">Home</span>
            </Link>
            <Link 
              to="/submit" 
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <AlertTriangle size={16} className="mr-3 text-emerald-600" />
              <span>Submit Report</span>
            </Link>
            <Link 
              to="/status" 
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ListChecks size={16} className="mr-3 text-blue-600" />
              <span>My Reports</span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheck size={16} className="mr-3 text-purple-600" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <div className="flex items-center justify-between px-3 py-2">
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              {isSignedIn && (
                <div className="flex items-center">
                  <img 
                    src={user?.imageUrl || "/api/placeholder/32/32"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border-2 border-emerald-500"
                  />
                  <span className="ml-2 text-sm font-medium">{user?.firstName || "User"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};