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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SeriesProfilePage() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(null);

  // Comment section states
  // const [comments, setComments] = useState([]);
  // const [newComment, setNewComment] = useState("");
  // const [commentLoading, setCommentLoading] = useState(false);
  // const [editingCommentId, setEditingCommentId] = useState(null);
  // const [editedContent, setEditedContent] = useState("");
  // const [token, setToken] = useState(null);
  // const [userId, setUserId] = useState(null);

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

  // Initialize client-side only values
  // useEffect(() => {
  //   setToken(localStorage.getItem("token"));
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     try {
  //       setUserId(JSON.parse(userData)?.id);
  //     } catch (e) {
  //       console.error("Error parsing user data:", e);
  //     }
  //   }
  // }, []);

  // Fetch series details
  useEffect(() => {
    if (!id) return;

    async function fetchSeries() {
      try {
        console.log("Fetching series with ID:", id);
        const seriesId = parseInt(id, 10);
        if (isNaN(seriesId)) throw new Error("Invalid series ID");

        const res = await fetch(`http://localhost:8008/series/${seriesId}`);
        console.log("Series response status:", res.status);
        
        if (!res.ok) throw new Error("Series not found");

        const data = await res.json();
        console.log("Series detail data:", data);
        setSeries(data.series_detail);
      } catch (err) {
        console.error("Error fetching series:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSeries();
  }, [id]);

  // Fetch episodes
  useEffect(() => {
    if (!id) return;
    
    async function fetchEpisodes() {
      try {
        const res = await fetch(`http://localhost:8008/series/${id}/episodes`);
        if (res.ok) {
          const data = await res.json();
          console.log("Episodes data:", data);
          setEpisodes(data);
        }
      } catch (err) {
        console.error("Error fetching episodes:", err);
      }
    }

    fetchEpisodes();
  }, [id]);

  // Fetch comments - only after token is set
  useEffect(() => {
    if (!id || !token) return;
    
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:8008/series/${id}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }
    fetchComments();
  }, [id, token]);

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, episode) => {
    const season = episode.season_number;
    if (!acc[season]) acc[season] = [];
    acc[season].push(episode);
    return acc;
  }, {});

  // Comment functions
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
        body: JSON.stringify({ series_id: parseInt(id), content: newComment }),
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

  const handleEditComment = (commentId, oldContent) => {
    setEditingCommentId(commentId);
    setEditedContent(oldContent);
  };

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

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !series) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">
          Series not found
        </Typography>
      </Box>
    );
  }

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
      {/* Series Info Section */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Box sx={{ minWidth: 300, flexShrink: 0 }}>
          <Box
            component="img"
            src={series.poster_url || '/placeholder-poster.jpg'}
            alt={series.title}
            sx={{ width: 300, borderRadius: 2, mb: 2 }}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "70%", mb: 1 }}
            onClick={() => window.open("https://www.youtube.com/", "_blank")}
          >
            Watch Now
          </Button>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {series.title}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {Array.isArray(series.genre) &&
              series.genre.map((g) => <Chip key={g} label={g} color="primary" />)}
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Director:</strong> {series.director || "Unknown"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Casts:</strong>{" "}
            {Array.isArray(series.casts)
              ? series.casts.join(", ")
              : series.casts || "Unknown"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>IMDB Rating:</strong>{" "}
            {series.imdb_rating ? series.imdb_rating.toFixed(1) : "Unknown"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Seasons:</strong> {series.total_seasons || 1}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Total Episodes:</strong> {series.total_episodes || 1}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 , width: 1100}}>
            {series.description || "No description available."}
          </Typography>
        </Box>
      </Box>

      {/* Episodes Section */}
      {/* <Divider sx={{ borderColor: "#444", my: 4 }} />
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Episodes
        </Typography>

        {Object.keys(episodesBySeason).length === 0 ? (
          <Typography>No episodes available.</Typography>
        ) : (
          Object.keys(episodesBySeason)
            .sort((a, b) => a - b)
            .map((season) => (
              <Accordion
                key={season}
                expanded={expandedSeason === season}
                onChange={() => setExpandedSeason(expandedSeason === season ? null : season)}
                sx={{ backgroundColor: "#2b2b2b", color: "#fff", mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                  <Typography variant="h6">Season {season}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {episodesBySeason[season]
                    .sort((a, b) => a.episode_number - b.episode_number)
                    .map((episode) => (
                      <Box
                        key={episode.episode_id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          mb: 1,
                          backgroundColor: "#1e1e1e",
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ minWidth: 60 }}>
                          <Typography variant="body2" color="primary">
                            E{episode.episode_number}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1">
                            {episode.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#aaa" }}>
                            {episode.duration} min •{" "}
                            {new Date(episode.release_date).toLocaleDateString()}
                          </Typography>
                          {episode.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {episode.description}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => window.open(episode.video_url || "#", "_blank")}
                        >
                          Watch
                        </Button>
                      </Box>
                    ))}
                </AccordionDetails>
              </Accordion>
            ))
        )}
      </Box> */}

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