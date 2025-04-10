import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import './index.css';
import Home from './pages/Home.tsx';
import SubmitComplaint from './pages/SubmitComplaint.tsx';
import Status from './pages/Status.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import Header from './components/Header.tsx';
import CheckFssai from './pages/checkFssai.tsx';

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk publishable key");
}

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitComplaint />} />
              <Route path="/status" element={<Status />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/check-fssai" element={<CheckFssai/>}/>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
