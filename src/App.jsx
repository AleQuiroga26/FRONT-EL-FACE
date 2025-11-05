import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DashboardLayout from "./components/DashboardLayout";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";
import { CommentProvider } from "./context/CommentContext";
import { CategoryProvider } from "./context/CategoryContext";
import CreateCategory from "./components/CreateCategory";
import Profile from "./components/Profile";

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <CommentProvider>
          <CategoryProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/crear-categoria"
                element={
                  <PrivateRoute>
                    <CreateCategory />
                  </PrivateRoute>
                }
              />
              <Route path="/perfil" element={<Profile />} />
            </Routes>
          </CategoryProvider>
        </CommentProvider>
      </PostProvider>
    </AuthProvider>
  );
}
