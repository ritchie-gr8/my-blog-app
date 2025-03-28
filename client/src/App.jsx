import Footer from "./components/global/Footer";
import Navbar from "./components/global/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";
import Member from "./pages/Member";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LogIn />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route
                path="/member"
                element={
                  <ProtectedRoute>
                    <Member />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
