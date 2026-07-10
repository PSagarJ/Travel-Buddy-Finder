import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [destination, setDestination] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const loggedInUser = localStorage.getItem("user");
  const currentUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error loading feed:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setStatus("You must be logged in to post a photo.");
      return;
    }
    if (!imageFile) {
      setStatus("Please choose a photo first.");
      return;
    }

    setUploading(true);
    setStatus("Uploading your travel memory...");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("destination", destination);

      const response = await api.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts([response.data, ...posts]);
      setCaption("");
      setDestination("");
      setImageFile(null);
      setPreview(null);
      setStatus("Posted!");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          color: "#0f172a",
          marginBottom: "1.5rem",
        }}
      >
        Travel memories
      </h1>

      {/* Upload form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "320px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: "0.75rem" }}
        />

        <input
          type="text"
          placeholder="Where was this taken?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
          }}
        />

        <textarea
          placeholder="Say something about this trip..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          disabled={uploading}
          style={{
            background: "#0284c7",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
          }}
        >
          {uploading ? "Posting..." : "Post photo"}
        </button>

        {status && (
          <p
            style={{
              marginTop: "0.75rem",
              color: "#0284c7",
              fontSize: "0.9rem",
            }}
          >
            {status}
          </p>
        )}
      </form>

      {/* Feed grid */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          Loading memories...
        </p>
      ) : posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>
          No travel photos yet. Be the first to share one!
        </p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.caption || "Travel photo"}
                style={{
                  width: "100%",
                  maxHeight: "420px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: "0.85rem 1rem" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "0 0 0.25rem 0",
                    color: "#0f172a",
                  }}
                >
                  <Link
                    to={`/profile/${post.userId}`}
                    style={{ color: "#0f172a", textDecoration: "none" }}
                  >
                    {post.userName}
                  </Link>
                  {post.destination && (
                    <span style={{ color: "#64748b", fontWeight: "normal" }}>
                      {" "}
                      · {post.destination}
                    </span>
                  )}
                </p>
                {post.caption && (
                  <p style={{ margin: 0, color: "#334155" }}>{post.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
