// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import styles from "../page.module.css";

// export default function HomePage() {
//   const router = useRouter();
//   const [movies, setMovies] = useState([]);
//   const [recentlyWatched, setRecentlyWatched] = useState([]);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   // Redirect to login if not logged in
//   useEffect(() => {
//     if (!token) router.push("/login");
//   }, [token, router]);

//   // Fetch movies
//   useEffect(() => {
//     async function fetchMovies() {
//       const res = await fetch("http://localhost:8008/movies");
//       const data = await res.json();
//       if (Array.isArray(data.movies)) setMovies(data.movies);
//     }
//     fetchMovies();
//   }, []);

//   // Fetch recently watched
//   useEffect(() => {
//   async function fetchRecentlyWatched() {
//     if (!token) return;
//     const res = await fetch("http://localhost:8008/recentlywatched", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     // Ensure data is an array
//     if (Array.isArray(data)) setRecentlyWatched(data);
//     else if (Array.isArray(data.recentlyWatched)) setRecentlyWatched(data.recentlyWatched);
//     else setRecentlyWatched([]); // fallback
//   }
//   fetchRecentlyWatched();
// }, [token]);

//   const handleWatchNow = async (movie) => {
//   if (!token) {
//     router.push("/login");
//     return;
//   }

//   await fetch("http://localhost:8008/recentlywatched", {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ movie_id: movie.id }),
//   });

//   setRecentlyWatched((prev = []) => {
//     const updated = [...prev.filter((m) => m.id !== movie.id), movie];
//     return updated.slice(-10); // keep last 10
//   });
// };


//   return (
//     <main className={styles.fullContainer}>
//       {/* Recently Watched */}
//       {recentlyWatched.length > 0 && (
//         <section className={styles.genreSection}>
//           <h2>Recently Watched</h2>
//           <div className={styles.moviesGrid}>
//             {recentlyWatched.map((movie) => (
//               <div key={movie.id} className={styles.movieCard}>
//                 <Link href={`/movies/${movie.id}`}>
//                   <img src={movie.poster_url} alt={movie.title} />
//                   <p>{movie.title}</p>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* All Movies / Trending */}
//       <section className={styles.genreSection}>
//         <h2>Trending Movies & Series</h2>
//         <div className={styles.moviesGrid}>
//           {movies.map((movie) => (
//             <div key={movie.id} className={styles.movieCard}>
//               <Link href={`/movies/${movie.id}`}>
//                 <img src={movie.poster_url} alt={movie.title} />
//                 <p>{movie.title}</p>
//               </Link>
//               <button onClick={() => handleWatchNow(movie)}>Watch Now</button>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import { Button } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState([]);

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

  // Load recently watched from localStorage or backend
  useEffect(() => {
    async function fetchRecentlyWatched() {
      if (!token) return;

      const stored = localStorage.getItem("recentlyWatched");
      if (stored) {
        setRecentlyWatched(JSON.parse(stored));
        return;
      }

      try {
        const res = await fetch("http://localhost:8008/recentlywatched", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        let recent = [];
        if (Array.isArray(data)) recent = data;
        else if (Array.isArray(data.recentlyWatched)) recent = data.recentlyWatched;

        recent = recent.slice(-10);
        setRecentlyWatched(recent);
        localStorage.setItem("recentlyWatched", JSON.stringify(recent));
      } catch (err) {
        console.error(err);
      }
    }

    fetchRecentlyWatched();
  }, [token]);

  // Handle watch now
  const handleWatchNow = async (movie) => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await fetch("http://localhost:8008/recentlywatched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movie.id }),
      });

      setRecentlyWatched((prev = []) => {
        const updated = [...prev.filter((m) => m.id !== movie.id), movie];
        const last10 = updated.slice(-10);
        localStorage.setItem("recentlyWatched", JSON.stringify(last10));
        return last10;
      });
    } catch (err) {
      console.error(err);
    }
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
        localStorage.removeItem("recentlyWatched");
      }
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={styles.fullContainer}>
      {/* Recently Watched */}
      {recentlyWatched.length > 0 && (
        <section className={styles.genreSection}>
          <h2>10 Favourites</h2>
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              padding: "8px 0",
              scrollbarWidth: "thin",
            }}
          >
            {recentlyWatched.map((movie) => (
              <div
                key={movie.id}
                className={styles.movieCard}
                style={{ minWidth: "160px", flexShrink: 0 }}
              >
                <Link href={`/movies/${movie.id}`}>
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    style={{ width: "160px", borderRadius: "8px" }}
                  />
                  <p style={{ color: "#fff", textAlign: "center" }}>{movie.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Movies / Trending */}
      <section className={styles.genreSection}>
        <h2>Trending Movies & Series</h2>
        <div className={styles.moviesGrid}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <Link href={`/movies/${movie.id}`}>
                <img src={movie.poster_url} alt={movie.title} />
                <p>{movie.title}</p>
              </Link>
              <button onClick={() => handleWatchNow(movie)}>Add to Favourites</button>
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
