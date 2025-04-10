import { useState, useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Define interfaces for type safety
interface Complaint {
  id: string;
  establishmentName: string;
  issueDate: string;
  issueType: string;
  status: string;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

// Define status types for better type checking
type StatusType = "submitted" | "under-review" | "investigating" | "resolved" | "rejected";

function Status() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, you'd fetch data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setComplaints([
        {
          id: "1",
          establishmentName: "Burger Place",
          issueDate: "2023-05-15",
          issueType: "food-quality",
          status: "under-review",
          submittedAt: "2023-05-16"
        },
        {
          id: "2",
          establishmentName: "Pizza Corner",
          issueDate: "2023-04-20",
          issueType: "hygiene",
          status: "resolved",
          submittedAt: "2023-04-21",
          resolvedAt: "2023-05-05",
          resolution: "The establishment was inspected and required to implement improved cleanliness protocols."
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      "submitted": "bg-blue-100 text-blue-800",
      "under-review": "bg-yellow-100 text-yellow-800",
      "investigating": "bg-purple-100 text-purple-800",
      "resolved": "bg-green-100 text-green-800",
      "rejected": "bg-red-100 text-red-800"
    };
    
    const statusText: Record<string, string> = {
      "submitted": "Submitted",
      "under-review": "Under Review",
      "investigating": "Investigating",
      "resolved": "Resolved",
      "rejected": "Rejected"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <>
      <SignedIn>
        <div>
          <h1 className="text-2xl font-bold mb-6">My Complaints</h1>
          
          {loading ? (
            <div className="text-center py-10">
              <p>Loading your complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium text-gray-700 mb-2">No complaints yet</h2>
              <p className="text-gray-500 mb-4">You haven't submitted any food safety complaints.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {complaints.map(complaint => (
                <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-medium">{complaint.establishmentName}</h2>
                    {getStatusBadge(complaint.status)}
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Issue Date</p>
                      <p>{complaint.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Issue Type</p>
                      <p className="capitalize">{complaint.issueType.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted On</p>
                      <p>{complaint.submittedAt}</p>
                    </div>
                    {complaint.resolvedAt && (
                      <div>
                        <p className="text-gray-500">Resolved On</p>
                        <p>{complaint.resolvedAt}</p>
                      </div>
                    )}
                  </div>
                  
                  {complaint.resolution && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm mb-1">Resolution</p>
                      <p>{complaint.resolution}</p>
                    </div>
                  )}
                </div>
              ))}
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

export default Status; 