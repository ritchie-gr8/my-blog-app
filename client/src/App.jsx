import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminLayout from "./layouts/AdminLayout";
import StandardLayout from "./layouts/StandardLayout";

const Landing = lazy(() => import("./pages/Landing"));
const LogIn = lazy(() => import("./pages/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Member = lazy(() => import("./pages/Member"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Confirm = lazy(() => import("./pages/Confirm"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <NotificationProvider>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </NotificationProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
