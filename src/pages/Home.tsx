import { useState, useEffect } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useOrganizationList
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  ListChecks,
  ShieldCheck,
  BadgeCheck,
  Loader2
} from "lucide-react";

function Home() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: orgsLoaded, organizationList } = useOrganizationList();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (
      userLoaded &&
      orgsLoaded &&
      user &&
      Array.isArray(organizationList)
    ) {
      const adminMembership = organizationList.find(
        (orgMembership) => orgMembership?.membership?.role === "Admin"
      );
      setIsAdmin(!!adminMembership);
    } else {
      setIsAdmin(false);
    }
  }, [userLoaded, orgsLoaded, user, organizationList]);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
                Welcome to FoodSafeWatch, {user?.firstName || "User"}!
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Your portal for food safety reporting and FSSAI license verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Submit Report Card */}
              <div className="group hover:scale-105 transition-all duration-300">
                <Link to="/submit" className="block h-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:border-emerald-500 border-2 border-transparent">
                  <div className="bg-emerald-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <AlertTriangle className="text-emerald-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors">Submit Report</h2>
                  <p className="text-gray-600 mb-4">Report a food safety concern or violation you've encountered.</p>
                  <div className="flex items-center text-emerald-600 font-medium">
                    Get started <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              </div>

              {/* My Reports Card */}
              <div className="group hover:scale-105 transition-all duration-300">
                <Link to="/status" className="block h-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:border-blue-500 border-2 border-transparent">
                  <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <ListChecks className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">My Reports</h2>
                  <p className="text-gray-600 mb-4">Track the status and updates of your submitted reports.</p>
                  <div className="flex items-center text-blue-600 font-medium">
                    View history <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              </div>

              {/* Check FSSAI License Card */}
              <div className="group hover:scale-105 transition-all duration-300">
                <Link to="/check-fssai" className="block h-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:border-orange-500 border-2 border-transparent">
                  <div className="bg-orange-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <BadgeCheck className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">Check FSSAI License</h2>
                  <p className="text-gray-600 mb-4">Verify the details and validity of an FSSAI license number.</p>
                  <div className="flex items-center text-orange-600 font-medium">
                    Verify now <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              </div>

              {/* Admin Dashboard - only if admin */}
              {isAdmin && (
                <div className="group hover:scale-105 transition-all duration-300">
                  <Link to="/admin" className="block h-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all group-hover:border-purple-500 border-2 border-transparent">
                    <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                      <ShieldCheck className="text-purple-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">Admin Dashboard</h2>
                    <p className="text-gray-600 mb-4">Manage reports and respond to user submissions.</p>
                    <div className="flex items-center text-purple-600 font-medium">
                      Access dashboard <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* How it Works Section (can customize later) */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">How FoodSafeWatch Works</h3>
              <div className="text-gray-600 space-y-2">
                <p>1. Submit food safety concerns using the platform.</p>
                <p>2. Track the progress of your complaints.</p>
                <p>3. Verify FSSAI licenses before purchasing food products.</p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default Home;
