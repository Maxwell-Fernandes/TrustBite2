import { useState, useEffect } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useOrganizationList,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";

function AdminDashboard() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organizationList, isLoaded: orgsLoaded } = useOrganizationList();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading, boolean after check

  // Check if user is admin
  useEffect(() => {
    if (userLoaded && orgsLoaded && user && Array.isArray(organizationList)) {
      const adminMembership = organizationList.find(
        (org) => org?.membership?.role === "Admin"
      );
      setIsAdmin(!!adminMembership);
    } else if (userLoaded && orgsLoaded) {
      setIsAdmin(false);
    }
  }, [userLoaded, orgsLoaded, user, organizationList]);

  // Show loader while checking
  if (isAdmin === null || !userLoaded || !orgsLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin content
  return (
    <>
      <SignedIn>
        <div className="flex justify-center items-center min-h-screen bg-green-50">
          <div className="text-center p-10 bg-white shadow-lg rounded-lg max-w-xl">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Welcome to the Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              You have administrative access to manage reports and user
              submissions.
            </p>
            <div className="mt-6">
              {/* Future dashboard components will go here */}
              <p className="text-sm text-gray-500">(Dashboard features coming soon...)</p>
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

export default AdminDashboard;
