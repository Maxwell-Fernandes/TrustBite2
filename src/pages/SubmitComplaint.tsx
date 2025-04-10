import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

interface FormData {
  category: string;
  subCategory: string;
  establishmentName: string;
  brandName: string;
  productName: string;
  batchNo: string;
  licenseNo: string;
  location: string;
  state: string;
  district: string;
  subDistrict: string;
  pinCode: string;
  issueDate: string;
  issueType: string;
  concernType: string;
  description: string;
  documents: File[] | null;
  documentDescription: string;
}

function SubmitComplaint() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    category: "",
    subCategory: "",
    establishmentName: "",
    brandName: "",
    productName: "",
    batchNo: "",
    licenseNo: "",
    location: "",
    state: "",
    district: "",
    subDistrict: "",
    pinCode: "",
    issueDate: "",
    issueType: "food-quality",
    concernType: "",
    description: "",
    documents: null,
    documentDescription: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Categories and subcategories mapping
  const categories = [
    "Package Food",
    "Food Catering Premises",
    "Online aggregator/e-commerce",
    "Retailer Premises",
    "Others"
  ];

  const subCategories: Record<string, string[]> = {
    "Package Food": [
      "Dairy products",
      "Fats & oils",
      "Edible ices including sorbet",
      "Confectionery",
      "Cereal & cereal products",
      "Bakery products",
      "Meat & meat products including poultry",
      "Fish & fish products",
      "Egg & egg products",
      "Sweeteners including honey",
      "Salt, spices, soups, sauces, salads & protein products",
      "Beverages excluding dairy products",
      "Ready to eat savouries",
      "Prepared food",
      "Nutraceuticals",
      "Fruit and Vegetables",
      "Others"
    ],
    "Food Catering Premises": [
      "Restaurant",
      "Café",
      "Food Stalls",
      "Food Trucks",
      "Catering Service",
      "Others"
    ],
    "Online aggregator/e-commerce": [
      "Food Delivery Platform",
      "Online Grocery",
      "Meal Kit Service",
      "Others"
    ],
    "Retailer Premises": [
      "Supermarket",
      "Grocery Store",
      "Convenience Store",
      "Specialty Food Store",
      "Others"
    ],
    "Others": ["Other Food Business"]
  };

  const concernTypes = [
    "Food Quality",
    "Hygiene Issues",
    "Allergen Concerns",
    "Foreign Objects",
    "Foodborne Illness",
    "Labeling Issues",
    "Expired Product",
    "Packaging Issues",
    "Others"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Others"
  ];

  // Mock districts - in a real app, these would be filtered by selected state
  const districts = ["Select District", "District 1", "District 2", "District 3"];
  
  // Mock sub-districts - in a real app, these would be filtered by selected district
  const subDistricts = ["Select Sub-District", "Sub-District 1", "Sub-District 2", "Sub-District 3"];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset sub-category when category changes
    if (name === "category") {
      setFormData({ ...formData, [name]: value, subCategory: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Check if adding this file would exceed 5 files
      if (selectedFiles.length + files.length > 5) {
        alert("Maximum 5 documents allowed");
        return;
      }
      
      // Add new files to existing selected files
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate that at least one document is uploaded
    if (selectedFiles.length === 0) {
      alert("At least one document must be uploaded");
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare form data with files for submission
    const submitData = {
      ...formData,
      documents: selectedFiles
    };
    
    // Here you would normally send the data to your backend
    // For demo purposes, we're just simulating a submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Complaint submitted successfully!");
    setIsSubmitting(false);
    navigate("/status");
  };

  return (
    <>
      <SignedIn>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-green-700">Register New Complaint</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Select Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Select Sub Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    required
                    disabled={!formData.category}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Sub Category</option>
                    {formData.category && 
                      subCategories[formData.category]?.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Product & Complaint Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-3 text-green-700">Product & Complaint Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Establishment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="establishmentName"
                    value={formData.establishmentName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Enter Brand Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    placeholder="Enter Product Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Batch No.
                  </label>
                  <input
                    type="text"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleChange}
                    placeholder="Enter Batch No"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    FSSAI License/Registration No.
                  </label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    placeholder="Enter license No"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Seller Address
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter Seller Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Sub-District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subDistrict"
                    value={formData.subDistrict}
                    onChange={handleChange}
                    required
                    disabled={!formData.district}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Sub-District</option>
                    {subDistricts.map((subDistrict) => (
                      <option key={subDistrict} value={subDistrict}>
                        {subDistrict}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="Enter Pin Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Date of Issue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Concern <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="concernType"
                    value={formData.concernType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Concern</option>
                    {concernTypes.map((concern) => (
                      <option key={concern} value={concern}>
                        {concern}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Complaint Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Please enter description related to complaint"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              
              {/* Document Upload Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Document Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="documentDescription"
                  value={formData.documentDescription}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Please enter description related to document"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp4,.webm,.avi,.wmv"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    >
                      Browse...
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    Note: Minimum one document should be uploaded. Maximum five documents are allowed.
                  </p>
                  <p className="text-xs text-red-500">
                    Document should be of type 'pdf', 'jpeg', 'jpg', 'png', 'doc', 'docx', 'mp4','webm','avi','wmv'
                    and maximum allowed file size is 5 MB.
                  </p>
                </div>
                
                <div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-700 mb-1">Selected Files:</p>
                      <ul className="text-sm">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Consumer Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-green-700">Consumer Details</h2>
                <button 
                  type="button" 
                  className="text-gray-400 hover:text-gray-600"
                >
                  −
                </button>
              </div>
              <p className="text-xs text-red-500 mb-4">Note: You can update your details in profile section.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={user?.firstName || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Enter Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Enter E-mail"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Mobile No.
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Mobile No."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-8 text-white font-medium rounded-md ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              
              <button
                type="button"
                className="py-2 px-8 text-white font-medium bg-gray-500 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default SubmitComplaint;