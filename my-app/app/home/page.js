//app/home/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { Button, Snackbar, Alert } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  // Fetch all movies
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("http://localhost:8008/movies");
        const data = await res.json();
        if (Array.isArray(data.movies)) setMovies(data.movies);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMovies();
  }, []);

  // Fetch series
  useEffect(() => {
    async function fetchSeries() {
      try {
        const res = await fetch("http://localhost:8008/series");
        const data = await res.json();
        if (Array.isArray(data.series)) setSeries(data.series);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSeries();
  }, []);

  // Fetch user favorites
  useEffect(() => {
    async function fetchFavorites() {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8008/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
          localStorage.setItem("favorites", JSON.stringify(data.favorites));
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchFavorites();
  }, [token]);

  // Show snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle add to favorites
  const handleAddToFavorites = async (movie) => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8008/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movie.id }),
      });

      if (response.ok) {
        setFavorites((prev) => {
          const updated = [...prev, movie];
          const last10 = updated.slice(-10);
          localStorage.setItem("favorites", JSON.stringify(last10));
          return last10;
        });
        showSnackbar("Added to favorites!", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.detail || "Failed to add to favorites", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error adding to favorites", "error");
    }
  };

  // Handle remove from favorites
  const handleRemoveFromFavorites = async (movieId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8008/favorites/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFavorites((prev) => {
          const updated = prev.filter((movie) => movie.id !== movieId);
          localStorage.setItem("favorites", JSON.stringify(updated));
          return updated;
        });
        showSnackbar("Removed from favorites!", "info");
      } else {
        showSnackbar("Failed to remove from favorites", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error removing from favorites", "error");
    }
  };

  // Check if movie is in favorites
  const isInFavorites = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  // Logout
  const handleSignOut = async () => {
    try {
      if (token) {
        await fetch("http://localhost:8008/signout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("favorites");
      }
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={styles.fullContainer}>
      {/* ✅ Snackbar for inline notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className={styles.genreSection}>
          <h2 style={{ color: "#fff", marginBottom: "20px" }}>
            My Favorites ({favorites.length}/10)
          </h2>
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              padding: "8px 0",
              scrollbarWidth: "thin",
            }}
          >
            {favorites.map((movie) => (
              <div key={movie.id} className={styles.movieCard}>
                <Link href={`/movies/${movie.id}`}>
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    style={{
                      width: "160px",
                      height: "240px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <p
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      margin: "8px 0",
                      fontSize: "14px",
                    }}
                  >
                    {movie.title}
                  </p>
                </Link>
                <button
                  onClick={() => handleRemoveFromFavorites(movie.id)}
                  style={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%",
                    fontSize: "12px",
                  }}
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Movies / Trending */}
<section className={styles.genreSection}>
  <h2 style={{ color: "#fff", marginBottom: "20px" }}>Trending Movies & Series</h2>
  <div className={styles.moviesGrid}>
    {[...movies, ...series].map((item) => (
      <div key={item.id || item.series_id} className={styles.movieCard}>
        <Link href={`/${item.total_seasons ? "series" : "movies"}/${item.id || item.series_id}`}>
          <img src={item.poster_url} alt={item.title} />
          <p>{item.title}</p>
        </Link>

        {isInFavorites(item.id || item.series_id) ? (
          <button
            onClick={() => handleRemoveFromFavorites(item.id || item.series_id)}
            style={{
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            ❤️ Remove from Favorites
          </button>
        ) : (
          <button
            onClick={() => handleAddToFavorites(item)}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            🤍 Add to Favorites
          </button>
        )}
      </div>
    ))}
  </div>
</section>


      {/* Logout Button */}
      <div style={{ textAlign: "center", marginTop: "40px", margin: "40px 40px" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "12px", maxWidth: "120px" }}
          onClick={handleSignOut}
        >
          Log Out
        </Button>
      </div>
    </main>
  );
}
