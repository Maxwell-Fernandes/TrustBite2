// src/pages/CheckFssai.js

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Search, AlertCircle, CheckCircle, UploadCloud, X } from 'lucide-react';

// Interface for the data returned by the FSSAI check API
interface FssaiLicenseData {
    _id: string;
    fssaiNumber: string;
    businessName: string;
    ownerName?: string; // Optional fields based on your schema
    address: string;
    state: string;
    contactEmail?: string;
    contactPhone?: string;
    issuedDate: string; // Assuming ISO string format
    expiryDate: string; // Assuming ISO string format
    licenseType: string;
    isValid: boolean;
    isMisused: boolean;
    lastChecked?: string;
}

// Simplified complaint data structure for this specific scenario
interface FssaiComplaintData {
    fssaiNumber: string; // Pre-filled from the check
    establishmentName: string; // User might know this
    location: string; // Where they saw the license
    state: string;
    district: string;
    description: string; // Why they think it's fake/invalid
    documents: File[];
    documentDescription: string;
}

function CheckFssai() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [fssaiToCheck, setFssaiToCheck] = useState<string>("");
    const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>(false);
    const [checkResult, setCheckResult] = useState<FssaiLicenseData | null>(null);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [showComplaintForm, setShowComplaintForm] = useState<boolean>(false);

    const [complaintFormData, setComplaintFormData] = useState<FssaiComplaintData>({
        fssaiNumber: "",
        establishmentName: "",
        location: "",
        state: "",
        district: "",
        description: "",
        documents: [],
        documentDescription: ""
    });
    const [isSubmittingComplaint, setIsSubmittingComplaint] = useState<boolean>(false);

    // Extract states from SubmitComplaint or define them here
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Chandigarh", "Others" // Consider adding Union Territories properly
    ];
    // Mock districts - ideally fetch based on state
    const districts = ["Select District", "District A", "District B"];

    // --- FSSAI Check Logic ---
    const handleCheckFssai = async (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!fssaiToCheck.trim()) {
            setCheckError("Please enter an FSSAI number.");
            return;
        }

        setIsLoadingCheck(true);
        setCheckResult(null);
        setCheckError(null);
        setShowComplaintForm(false); // Reset complaint form visibility

        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/fssai/check/${encodeURIComponent(fssaiToCheck.trim())}`);

            if (response.ok) {
                const data: FssaiLicenseData = await response.json();
                setCheckResult(data);
                // Check if license is valid AND not misused
                if (data.isValid && !data.isMisused) {
                    setShowComplaintForm(false); // Valid license, no complaint needed
                    setCheckError(null) // Clear any previous error like "not found"
                } else {
                    // Found but invalid or misused
                    setCheckError(`License found but is marked as ${!data.isValid ? 'INVALID' : ''}${!data.isValid && data.isMisused ? ' and' : ''}${data.isMisused ? ' MISUSED' : ''}. Please report if you suspect an issue.`);
                    setShowComplaintForm(true);
                    // Pre-fill complaint form
                    setComplaintFormData(prev => ({
                        ...prev,
                        fssaiNumber: data.fssaiNumber,
                        establishmentName: data.businessName || "", // Pre-fill if available
                        state: data.state || "",
                        location: data.address || ""
                    }));
                }
            } else if (response.status === 404) {
                setCheckError("FSSAI number not found in our records. It might be invalid or fake. Please file a report if you encountered this license.");
                setShowComplaintForm(true);
                // Pre-fill complaint form with the number checked
                setComplaintFormData(prev => ({ ...prev, fssaiNumber: fssaiToCheck.trim() }));
            } else {
                // Other server errors
                const errorData = await response.text();
                setCheckError(`Error checking license: ${response.status} - ${errorData || response.statusText}`);
                setShowComplaintForm(false);
            }
        } catch (error) {
            console.error("FSSAI Check API Error:", error);
            setCheckError("Failed to connect to the verification service. Please try again later.");
            setShowComplaintForm(false);
        } finally {
            setIsLoadingCheck(false);
        }
    };

    // --- Complaint Form Logic (Adapted from SubmitComplaint) ---
    const handleComplaintChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setComplaintFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleComplaintFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            // Limit total files (e.g., max 5)
            const combinedFiles = [...complaintFormData.documents, ...newFiles].slice(0, 5);
            setComplaintFormData(prev => ({ ...prev, documents: combinedFiles }));
             // Optional: Clear the file input after selection for cleaner UX if needed
             e.target.value = '';
        }
    };

    const removeComplaintFile = (index: number) => {
        setComplaintFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleComplaintSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (complaintFormData.documents.length === 0) {
            alert("Please upload at least one supporting document (e.g., photo of the license/establishment).");
            return;
        }
        if (!complaintFormData.description.trim()) {
            alert("Please provide a description explaining the issue or where you saw the license.");
            return;
        }

        setIsSubmittingComplaint(true);

        // Use FormData to send multipart data (including files)
        const dataToSubmit = new FormData();
        dataToSubmit.append('fssaiNumber', complaintFormData.fssaiNumber);
        dataToSubmit.append('establishmentName', complaintFormData.establishmentName);
        dataToSubmit.append('location', complaintFormData.location);
        dataToSubmit.append('state', complaintFormData.state);
        dataToSubmit.append('district', complaintFormData.district);
        // Add a specific category/concern type for this kind of complaint
        dataToSubmit.append('category', 'FSSAI License Issue');
        dataToSubmit.append('concernType', 'Invalid/Fake/Misused License Report');
        dataToSubmit.append('description', complaintFormData.description);
        dataToSubmit.append('documentDescription', complaintFormData.documentDescription || "Evidence for FSSAI license issue"); // Add a default or ensure it's captured

        // Append user details (important for tracking)
        dataToSubmit.append('userId', user?.id || '');
        dataToSubmit.append('userName', user?.fullName || '');
        dataToSubmit.append('userEmail', user?.primaryEmailAddress?.emailAddress || '');

        // Append files
        complaintFormData.documents.forEach((file) => {
            dataToSubmit.append('documents', file); // Ensure backend handles multiple files with the same key 'documents'
        });


        try {
            // Replace with your actual complaint submission API endpoint
            const response = await fetch('/api/complaints', {
                method: 'POST',
                body: dataToSubmit,
                // Don't set 'Content-Type': 'multipart/form-data', browser does it with boundary
            });

            if (response.ok) {
                alert("Complaint about FSSAI license submitted successfully!");
                navigate("/status"); // Redirect to status page after submission
            } else {
                const errorText = await response.text();
                alert(`Failed to submit complaint: ${errorText || response.statusText}`);
            }
        } catch (error) {
            console.error("Complaint Submission API Error:", error);
            alert("An error occurred while submitting the complaint. Please try again.");
        } finally {
            setIsSubmittingComplaint(false);
        }
    };


    return (
        <>
            <SignedIn>
                <div className="max-w-4xl mx-auto p-4 md:p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center text-orange-700">Check FSSAI License Validity</h1>

                    {/* --- FSSAI Check Section --- */}
                    <form onSubmit={handleCheckFssai} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-orange-200">
                        <label htmlFor="fssaiToCheck" className="block text-lg font-semibold text-gray-700 mb-2">
                            Enter FSSAI License Number
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                id="fssaiToCheck"
                                value={fssaiToCheck}
                                onChange={(e) => setFssaiToCheck(e.target.value)}
                                placeholder="e.g., 100XXXXXXXXXXXXX"
                                required
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoadingCheck}
                                className={`px-6 py-2 text-white font-medium rounded-md flex items-center justify-center transition-colors ${isLoadingCheck
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                            >
                                {isLoadingCheck ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <Search size={20} className="mr-2" />
                                )}
                                {isLoadingCheck ? "Checking..." : "Check"}
                            </button>
                        </div>
                        {/* Display General Check Error */}
                         {checkError && !showComplaintForm && ( // Only show general error if not showing complaint form yet
                            <p className="mt-4 text-red-600 flex items-center">
                                <AlertCircle size={18} className="mr-2" />
                                {checkError}
                            </p>
                        )}
                    </form>

                    {/* --- Display Valid License Details Section --- */}
                    {checkResult && !showComplaintForm && (
                        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-green-700 flex items-center">
                                <CheckCircle size={24} className="mr-2" /> License Details (Valid)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
                                <p><strong className="font-medium text-gray-800">FSSAI Number:</strong> {checkResult.fssaiNumber}</p>
                                <p><strong className="font-medium text-gray-800">Business Name:</strong> {checkResult.businessName}</p>
                                {checkResult.ownerName && <p><strong className="font-medium text-gray-800">Owner Name:</strong> {checkResult.ownerName}</p>}
                                <p><strong className="font-medium text-gray-800">License Type:</strong> {checkResult.licenseType}</p>
                                <p><strong className="font-medium text-gray-800">State:</strong> {checkResult.state}</p>
                                <p><strong className="font-medium text-gray-800">Address:</strong> {checkResult.address}</p>
                                <p><strong className="font-medium text-gray-800">Issued Date:</strong> {new Date(checkResult.issuedDate).toLocaleDateString()}</p>
                                <p><strong className="font-medium text-gray-800">Expiry Date:</strong> {new Date(checkResult.expiryDate).toLocaleDateString()}</p>
                                {checkResult.contactEmail && <p><strong className="font-medium text-gray-800">Contact Email:</strong> {checkResult.contactEmail}</p>}
                                {checkResult.contactPhone && <p><strong className="font-medium text-gray-800">Contact Phone:</strong> {checkResult.contactPhone}</p>}
                            </div>
                        </div>
                    )}

                    {/* --- Complaint Form Section (Shown when needed) --- */}
                    {showComplaintForm && (
                        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
                            <h2 className="text-2xl font-semibold mb-2 text-red-700 flex items-center">
                                <AlertCircle size={24} className="mr-2" /> Report Invalid/Fake/Misused License
                            </h2>
                             {/* Display specific check error leading to complaint */}
                            {checkError && (
                                <p className="mb-4 text-red-600">{checkError}</p>
                            )}

                            <form onSubmit={handleComplaintSubmit} className="space-y-6">
                                {/* Simplified Complaint Details */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                        FSSAI Number Being Reported <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fssaiNumber"
                                        value={complaintFormData.fssaiNumber}
                                        readOnly // Pre-filled and read-only
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-red-700 mb-1">
                                            Establishment Name (if known)
                                        </label>
                                        <input
                                            type="text"
                                            name="establishmentName"
                                            value={complaintFormData.establishmentName}
                                            onChange={handleComplaintChange}
                                            placeholder="e.g., Name of the shop/restaurant"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-red-700 mb-1">
                                            Location/Address where seen <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={complaintFormData.location}
                                            onChange={handleComplaintChange}
                                            required
                                            placeholder="Street Address, City"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-red-700 mb-1">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={complaintFormData.state}
                                            onChange={handleComplaintChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-red-700 mb-1">
                                            District
                                        </label>
                                        <select
                                            name="district"
                                            value={complaintFormData.district}
                                            onChange={handleComplaintChange}
                                            // required // Maybe not strictly required here
                                            disabled={!complaintFormData.state} // Basic disabling
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">Select District</option>
                                            {districts.map((district) => ( // Use dynamic districts if possible
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                        Reason for Reporting / Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={complaintFormData.description}
                                        onChange={handleComplaintChange}
                                        required
                                        rows={4}
                                        placeholder="Describe why you believe this license is invalid, fake, or misused, and where you encountered it."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    ></textarea>
                                </div>

                                {/* Document Upload Section (Simplified) */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                        Upload Supporting Documents <span className="text-red-500">*</span>
                                    </label>
                                     <textarea
                                        name="documentDescription"
                                        value={complaintFormData.documentDescription}
                                        onChange={handleComplaintChange}
                                        rows={2}
                                        placeholder="Briefly describe the documents (e.g., 'Photo of storefront', 'Receipt showing license')"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                                    ></textarea>
                                    <div className="flex items-center border border-dashed border-gray-400 p-4 rounded-md">
                                        <label htmlFor="complaint-files" className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800">
                                            <UploadCloud size={20} className="mr-2" />
                                            <span>Choose files... (Max 5, up to 5MB each)</span>
                                        </label>
                                        <input
                                            id="complaint-files"
                                            type="file"
                                            multiple
                                            onChange={handleComplaintFileChange}
                                            className="hidden" // Hide the default input
                                            accept=".pdf,.jpg,.jpeg,.png" // Limit file types as needed
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Allowed types: PDF, JPG, PNG. Min 1 file required.</p>
                                    {complaintFormData.documents.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Selected Files:</p>
                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                {complaintFormData.documents.map((file, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeComplaintFile(index)}
                                                            className="text-red-500 hover:text-red-700 ml-2"
                                                            title="Remove file"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Consumer Details (Read Only) */}
                                <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
                                     <h3 className="text-md font-semibold text-gray-700 mb-2">Your Details (Reporter)</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <p><strong className="font-medium">Name:</strong> {user?.fullName || "N/A"}</p>
                                        <p><strong className="font-medium">Email:</strong> {user?.primaryEmailAddress?.emailAddress || "N/A"}</p>
                                     </div>
                                      <p className="text-xs text-gray-500 mt-2">Your details are recorded with the complaint.</p>
                                </div>


                                {/* Submit Button for Complaint */}
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingComplaint}
                                        className={`py-2 px-8 text-white font-medium rounded-md flex items-center justify-center transition-colors ${
                                            isSubmittingComplaint ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                                        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                    >
                                        {isSubmittingComplaint ? (
                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null }
                                        {isSubmittingComplaint ? "Submitting Report..." : "Submit Report"}
                                    </button>
                                </div>
                            </form>
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

export default CheckFssai;