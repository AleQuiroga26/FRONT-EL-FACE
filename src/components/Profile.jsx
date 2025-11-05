import { useContext, useEffect } from "react";
import { PostContext } from "../context/PostContext";
import { AuthContext } from "../context/AuthContext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";

export default function Profile() {
  const { posts, fetchPosts, deletePost } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts(); // cargar posts de todos
  }, []);

  // Evitar errores si user es null
  if (!user) return <p>Cargando perfil...</p>;

  // Filtrar solo los posts del usuario
  const userPosts = posts.filter((p) => p.author?.id === user.id);

  return (
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
            <Card
              key={post.id}
              className="post-card-gray mb-3"
              title={post.title || "Sin título"}
            >
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
  );
}
