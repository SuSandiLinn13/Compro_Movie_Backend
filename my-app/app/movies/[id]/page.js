"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  TextField,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MovieProfilePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- Comment Section ---
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Inline edit states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const userId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))?.id
      : null;

  // Fetch movie
  useEffect(() => {
    if (!id) return;

    async function fetchMovie() {
      try {
        const movieId = parseInt(id, 10);
        if (isNaN(movieId)) throw new Error("Invalid movie ID");

        const res = await fetch(`http://localhost:8008/movie/${movieId}`);
        if (!res.ok) throw new Error("Movie not found");

        const data = await res.json();
        setMovie(data.movie_detail);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:8008/movies/${id}/comments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchComments();
  }, [id, token]);

  // Add new comment
  const handleAddComment = async () => {
    if (!token) {
      alert("Please log in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const res = await fetch("http://localhost:8008/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: parseInt(id), content: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();

      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Start editing a comment
  const handleEditComment = (commentId, oldContent) => {
    setEditingCommentId(commentId);
    setEditedContent(oldContent);
  };

  // Save edited comment
  const handleSaveEdit = async (commentId) => {
    if (!editedContent.trim()) return;

    try {
      const res = await fetch(`http://localhost:8008/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!res.ok) throw new Error("Failed to update comment");
      const updated = await res.json();

      setComments((prev) =>
        prev.map((c) => (c.comment_id === commentId ? updated : c))
      );

      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to update comment.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    // if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:8008/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment.");
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5, ml: 5 }} />;
  if (error || !movie)
    return (
      <Typography sx={{ mt: 5 }} color="error">
        Movie not found
      </Typography>
    );

  return (
    <Box
      sx={{
        maxWidth: "100%",
        mx: "auto",
        mt: 12,
        px: 3,
        padding: "6rem 6rem",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        backgroundColor: "#1e1e1e",
        color: "#fff",
      }}
    >
      {/* Movie Info Section */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Box sx={{ minWidth: 300, flexShrink: 0 }}>
          <Box
            component="img"
            src={movie.poster_url}
            alt={movie.title}
            sx={{ width: 300, borderRadius: 2, mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "70%" }}
            onClick={() => window.open("https://www.youtube.com/", "_blank")}
          >
            Watch Now
          </Button>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {movie.title}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {Array.isArray(movie.genre) &&
              movie.genre.map((g) => <Chip key={g} label={g} color="primary" />)}
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Director:</strong> {movie.director || "Unknown"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Casts:</strong>{" "}
            {Array.isArray(movie.casts)
              ? movie.casts.join(", ")
              : movie.casts || "Unknown"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>IMDB Rating:</strong>{" "}
            {movie.imdb_rating ? movie.imdb_rating.toFixed(1) : "Unknown"}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 , width: 1100}}>
            {movie.description || "No description available."}
          </Typography>
        </Box>
      </Box>

      {/* Comment Section */}
      <Divider sx={{ borderColor: "#444", my: 4 }} />
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Comments
        </Typography>

        {/* Add Comment */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              backgroundColor: "#2c2c2c",
              input: { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#666",
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            disabled={commentLoading}
            onClick={handleAddComment}
          >
            {commentLoading ? "Posting..." : "Post"}
          </Button>
        </Box>

        {/* Display Comments */}
        {comments.length === 0 ? (
          <Typography>No comments yet. Be the first to comment!</Typography>
        ) : (
          comments.map((comment) => (
            <Paper
              key={comment.comment_id}
              sx={{
                backgroundColor: "#2b2b2b",
                color: "#fff",
                p: 2,
                mb: 2,
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Typography variant="subtitle2" color="primary">
                {comment.user?.username || "Unknown user"}
              </Typography>

              {/* Inline edit box */}
              {editingCommentId === comment.comment_id ? (
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    sx={{
                      backgroundColor: "#1e1e1e",
                      input: { color: "#fff" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSaveEdit(comment.comment_id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditedContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {comment.content}
                </Typography>
              )}

              <Typography
                variant="caption"
                sx={{ color: "#aaa", mt: 1, display: "block" }}
              >
                {new Date(comment.created_at).toLocaleString()}
              </Typography>

              {/* Edit/Delete Buttons */}
              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleEditComment(comment.comment_id, comment.content)
                  }
                  sx={{ color: "#bbb" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  sx={{ color: "#f55" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
}
