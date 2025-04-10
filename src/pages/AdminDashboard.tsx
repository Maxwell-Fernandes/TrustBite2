import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  AlertTriangle,
  MessageSquare,
  Filter
} from "lucide-react";

// Define interfaces for type safety
interface User {
  name: string;
  email: string;
}

interface Complaint {
  id: string;
  user: User;
  establishmentName: string;
  location: string;
  issueDate: string;
  issueType: string;
  description: string;
  status: string;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

// Status badge component that shows icon + text based on status
const StatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case "submitted":
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock size={14} className="mr-1" /> Submitted
        </span>
      );
    case "under-review":
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Search size={14} className="mr-1" /> Under Review
        </span>
      );
    case "investigating":
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertTriangle size={14} className="mr-1" /> Investigating
        </span>
      );
    case "resolved":
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={14} className="mr-1" /> Resolved
        </span>
      );
    case "rejected":
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle size={14} className="mr-1" /> Rejected
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 inline-flex items-center rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};

function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Option A: Email-based admin check (add your admin emails here)
  const isAdmin = isLoaded && 
    ["admin@trustbite.com", "admin@foodsafewatch.com"].includes(
      user?.primaryEmailAddress?.emailAddress || ""
    );
  
  // Option B: Metadata-based admin check
  // const isAdmin = isLoaded && user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      // In a real app, you'd fetch data from your API
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        setComplaints([
          {
            id: "1",
            user: {
              name: "John Doe",
              email: "john@example.com"
            },
            establishmentName: "Burger Place",
            location: "123 Main St, Anytown",
            issueDate: "2023-05-15",
            issueType: "food-quality",
            description: "I found a hair in my burger.",
            status: "under-review",
            submittedAt: "2023-05-16"
          },
          {
            id: "2",
            user: {
              name: "Jane Smith",
              email: "jane@example.com"
            },
            establishmentName: "Pizza Corner",
            location: "456 Oak Ave, Somewhere",
            issueDate: "2023-04-20",
            issueType: "hygiene",
            description: "The kitchen staff were not wearing gloves while preparing food.",
            status: "under-review",
            submittedAt: "2023-04-21"
          },
          {
            id: "3",
            user: {
              name: "Bob Johnson",
              email: "bob@example.com"
            },
            establishmentName: "Taco Town",
            location: "789 Pine St, Elsewhere",
            issueDate: "2023-03-10",
            issueType: "foodborne-illness",
            description: "I became ill after eating here and had to visit the hospital.",
            status: "resolved",
            submittedAt: "2023-03-11",
            resolvedAt: "2023-03-25",
            resolution: "Investigation confirmed food safety issues. Establishment has been issued warnings and required to improve practices."
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isAdmin]);

  // Filter and search effect
  useEffect(() => {
    let result = [...complaints];
    
    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(item => item.status === filterStatus);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.establishmentName.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        item.user.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredComplaints(result);
  }, [complaints, filterStatus, searchTerm]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status: newStatus } : complaint
    ));
  };

  const handleResolve = (id: string) => {
    if (!resolution.trim()) {
      alert("Please enter a resolution description");
      return;
    }

    setComplaints(complaints.map(complaint => 
      complaint.id === id ? {
        ...complaint,
        status: "resolved",
        resolvedAt: new Date().toISOString().split('T')[0],
        resolution
      } : complaint
    ));
    
    setSelectedComplaint(null);
    setResolution("");
  };

  if (isLoaded && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Debug output to check admin status - remove in production
  console.log({
    isLoaded,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    isAdmin: isAdmin
  });

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">TrustBite Admin Dashboard</h1>
              <p className="opacity-90 mt-1">Manage food safety reports and monitor resolution progress</p>
            </div>
            
            {/* Stats and filters */}
            <div className="bg-white p-4 md:p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="text-xs text-gray-500">Total Reports</div>
                    <div className="text-lg font-bold">{complaints.length}</div>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-500">Open</div>
                    <div className="text-lg font-bold">
                      {complaints.filter(c => c.status !== "resolved" && c.status !== "rejected").length}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-500">Resolved</div>
                    <div className="text-lg font-bold">
                      {complaints.filter(c => c.status === "resolved").length}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Filter */}
                  <div className="relative inline-block">
                    <div className="flex items-center">
                      <Filter size={18} className="mr-2 text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="all">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="under-review">Under Review</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reports table */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reports...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="flex justify-center">
                      <MessageSquare size={48} className="text-gray-300" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-600">No reports found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Establishment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredComplaints.map(complaint => (
                        <tr key={complaint.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{complaint.establishmentName}</div>
                            <div className="text-sm text-gray-500">{complaint.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize">{complaint.issueType.replace('-', ' ')}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{complaint.user.name}</div>
                            <div className="text-sm text-gray-500">{complaint.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.submittedAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                              >
                                View
                              </button>
                              {complaint.status !== "resolved" && (
                                <button
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setResolution("");
                                  }}
                                  className="text-emerald-600 hover:text-emerald-900 transition-colors"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
          
          {/* Report Detail Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800">{selectedComplaint.establishmentName}</h2>
                    <button
                      onClick={() => {
                        setSelectedComplaint(null);
                        setResolution("");
                      }}
                      className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">Report Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium">{selectedComplaint.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issue Date</p>
                          <p className="font-medium">{selectedComplaint.issueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Submission Date</p>
                          <p className="font-medium">{selectedComplaint.submittedAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issue Type</p>
                          <p className="font-medium capitalize">{selectedComplaint.issueType.replace("-", " ")}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">Reporter Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-medium">{selectedComplaint.user.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contact Email</p>
                          <p className="font-medium">{selectedComplaint.user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-800">{selectedComplaint.description}</p>
                  </div>
                  
                  {selectedComplaint.resolution && (
                    <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="font-medium text-green-800 mb-2">Resolution</h3>
                      <p className="text-green-900">{selectedComplaint.resolution}</p>
                      {selectedComplaint.resolvedAt && (
                        <p className="text-xs text-green-700 mt-2">Resolved on: {selectedComplaint.resolvedAt}</p>
                      )}
                    </div>
                  )}
                  
                  {selectedComplaint.status !== "resolved" && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-3 text-gray-800">Resolve Report</h3>
                      <textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Enter resolution details..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleResolve(selectedComplaint.id)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default AdminDashboard;