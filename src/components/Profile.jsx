import { useContext, useEffect, useState } from "react";
import { PostContext } from "../context/PostContext";
import { AuthContext } from "../context/AuthContext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Profile() {
  const { posts, fetchPosts, deletePost } = useContext(PostContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // === Estado para modo oscuro ===
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!user) return <p>Cargando perfil...</p>;

  const userPosts = posts.filter((p) => p.author?.id === user.id);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`layout-wrapper ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        onLogout={handleLogout}
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode((prev) => !prev)}
      />

      <div className="profile-container p-4">
        <Card title={`Perfil de @${user?.username || "usuario"}`} className="feed-card-gray">
          <div className="flex align-items-center gap-3 mb-3">
            <Avatar
              label={user?.username ? user.username[0].toUpperCase() : "U"}
              shape="circle"
              size="xlarge"
              style={{ backgroundColor: "#ccd8ff", color: "#003399" }}
            />
            <div>
              <p>Email: {user.email}</p>
              <p>Rol: {user.role}</p>
            </div>
          </div>
        </Card>

        <Divider />

        <h3 className="mb-2">Mis publicaciones</h3>

        <ScrollPanel style={{ width: "100%", height: "60vh" }}>
          {userPosts.length === 0 ? (
            <p>No tienes publicaciones todavía</p>
          ) : (
            userPosts.map((post) => (
              <Card key={post.id} className="post-card-gray mb-3">
                <div className="flex align-items-center gap-2 mb-2">
                  <Avatar
                    label={post.author?.username?.[0]?.toUpperCase() || "U"}
                    size="normal"
                    shape="circle"
                    style={{ backgroundColor: "#ccd8ff", color: "#003399" }}
                  />
                  <div>
                    <strong>@{post.author?.username || "Usuario"}</strong>
                    <p className="text-sm text-gray-500 m-0">
                      {post.category?.name || "Sin categoría"}
                    </p>
                  </div>
                </div>

                <p>{post.content}</p>

                <div className="flex justify-content-end">
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={() => deletePost(post.id)}
                  />
                </div>
              </Card>
            ))
          )}
        </ScrollPanel>
      </div>
    </div>
  );
}
