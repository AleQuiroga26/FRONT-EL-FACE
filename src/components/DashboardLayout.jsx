import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import { CommentContext } from "../context/CommentContext";
import { CategoryContext } from "../context/CategoryContext";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";
import { Dropdown } from "primereact/dropdown";

import Navbar from "./Navbar";
import "../styles/DashboardLayout.css";

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const { posts, createPost, fetchPosts } = useContext(PostContext);
  const { comments, createComment } = useContext(CommentContext);
  const { categories, fetchCategories } = useContext(CategoryContext);

  const navigate = useNavigate();
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !selectedCategory) return;

    await createPost("Sin título", newPost, selectedCategory.id);
    setNewPost("");
    setSelectedCategory(null);
  };

  const handleComment = async (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;
    await createComment(commentText, postId);
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="layout-wrapper">
      {/* Navbar superior */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="layout-content">
        <main className="retro-feed-gray">
          {/* Crear publicación */}
          <Card title="Crear publicación" className="feed-card-gray">
            <form onSubmit={handlePost} className="new-post-form-gray">
              <div className="post-inputs-row">
                <Avatar
                  label={user?.username?.[0]?.toUpperCase() || "U"}
                  shape="circle"
                  size="large"
                  className="post-avatar"
                />
                <InputTextarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={2}
                  placeholder="¿Qué estás pensando?"
                  autoResize
                  className="post-textarea"
                />
                <Dropdown
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.value)}
                  options={categories}
                  optionLabel="name"
                  placeholder="Selecciona una categoría"
                  className="post-dropdown"
                />
                <Button
                  label="Publicar"
                  icon="pi pi-send"
                  type="submit"
                  className="post-button"
                />
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
                  }
                >
                  <p className="m-0">{post.content}</p>

                  <Divider />
                  <div className="comments-section">
                    {comments
                      .filter((c) => c.post_id === post.id)
                      .map((c) => (
                        <div key={c.id} className="comment mb-2">
                          <strong>@{c.author?.username}</strong>: {c.text}
                        </div>
                      ))}

                    <div className="flex align-items-center gap-2 mt-2">
                      <InputTextarea
                        value={newComments[post.id] || ""}
                        onChange={(e) =>
                          setNewComments((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        rows={1}
                        placeholder="Escribe un comentario..."
                        autoResize
                        className="flex-1"
                      />
                      <Button
                        icon="pi pi-send"
                        className="p-button-text"
                        onClick={() => handleComment(post.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </ScrollPanel>
        </main>
      </div>
    </div>
  );
}
