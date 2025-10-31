import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { Menubar } from "primereact/menubar";
import { ScrollPanel } from "primereact/scrollpanel";

import "../styles/DashboardLayout.css";

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (newPost.trim() === "") return;
    setPosts([
      { id: Date.now(), text: newPost, author: user?.username || "Anónimo" },
      ...posts,
    ]);
    setNewPost("");
  };

  const menuItems = [
    { label: "Inicio", icon: "pi pi-home" },
    { label: "Explorar", icon: "pi pi-compass" },
    { label: "Mensajes", icon: "pi pi-envelope" },
    { label: "Notificaciones", icon: "pi pi-bell" },
    { label: "Cerrar sesión", icon: "pi pi-sign-out", command: handleLogout },
  ];

  return (
    <div className="retro-dashboard-gray">
      {/* Sidebar desktop */}
      <aside className="retro-sidebar-gray">
        <h2 className="logo">elFace</h2>
        <div className="menu">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              icon={item.icon}
              label={item.label}
              className="p-button-text w-full sidebar-btn-gray"
              onClick={item.command}
            />
          ))}
        </div>
      </aside>

      {/* Navbar mobile */}
      <Menubar
        start={
          <div className="flex align-items-center gap-2">
            <Button
              icon="pi pi-bars"
              className="p-button-text"
              onClick={() => setSidebarVisible(true)}
            />
            <h3 className="logo-sm">elFace</h3>
          </div>
        }
        end={
          <Avatar
            label={user?.username?.[0]?.toUpperCase() || "U"}
            shape="circle"
            size="large"
            style={{ backgroundColor: "#ccd8ff", color: "#003399" }}
          />
        }
        className="retro-topbar-gray"
      />

      {/* Sidebar mobile */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="mobile-sidebar-gray"
      >
        <h2 className="logo">elFace</h2>
        {menuItems.map((item) => (
          <Button
            key={item.label}
            icon={item.icon}
            label={item.label}
            className="p-button-text w-full sidebar-btn-gray"
            onClick={() => {
              setSidebarVisible(false);
              if (item.command) item.command();
            }}
          />
        ))}
      </Sidebar>

      {/* Feed */}
      <main className="retro-feed-gray">
        <Card title="Inicio" className="feed-card-gray">
          <form onSubmit={handlePost} className="new-post-form-gray">
            <div className="flex align-items-start gap-3">
              <Avatar
                label={user?.username?.[0]?.toUpperCase() || "U"}
                shape="circle"
                size="large"
                style={{ backgroundColor: "#ccd8ff", color: "#003399" }}
              />
              <div className="flex flex-column w-full">
                <InputTextarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  placeholder="¿Qué está pasando?"
                  autoResize
                  className="w-full"
                />
                <div className="flex justify-content-end mt-2">
                  <Button label="Postear" icon="pi pi-send" type="submit" />
                </div>
              </div>
            </div>
          </form>
        </Card>

        <Divider />

        <ScrollPanel style={{ width: "100%", height: "70vh" }}>
          {posts.length === 0 ? (
            <p className="text-center mt-4">Aún no hay publicaciones</p>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="post-card-gray mb-3"
                header={
                  <div className="flex align-items-center gap-2">
                    <Avatar
                      label={post.author[0].toUpperCase()}
                      size="normal"
                      shape="circle"
                      style={{ backgroundColor: "#ccd8ff", color: "#003399" }}
                    />
                    <strong>@{post.author}</strong>
                  </div>
                }
              >
                <p className="m-0">{post.text}</p>
              </Card>
            ))
          )}
        </ScrollPanel>
      </main>
    </div>
  );
}
