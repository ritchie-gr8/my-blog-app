import Footer from "./components/global/Footer";
import Navbar from "./components/global/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";
import Member from "./pages/Member";
import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/member" element={<Member />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
