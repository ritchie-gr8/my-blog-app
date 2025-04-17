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
import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import StandardLayout from "./layouts/StandardLayout";
import Confirm from "./pages/Confirm";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route element={<StandardLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/confirm/:token" element={<Confirm />} />
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
            </Route>
          </Routes>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
