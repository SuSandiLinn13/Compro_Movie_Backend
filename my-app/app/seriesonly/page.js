// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import styles from "../page.module.css";

// export default function MoviesPage() {
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     async function fetchMovies() {
//       const res = await fetch("http://localhost:8008/seriesonly");
//       if (res.ok) {
//         const data = await res.json();
//         setMovies(data);
//       }
//     }
//     fetchMovies();
//   }, []);

//   return (
//     <main className={styles.fullContainer}>
//         <section className={styles.genreSection}>
//             <h2>Series</h2>
//             <div className={styles.moviesGrid}>
//                 {movies.map((movie, index) => (
//                     <Link
//                     key={`${movie.movie_id}-${index}`}
//                     href={`/movies/${movie.movie_id}`}
//                     className={styles.movieCard}
//                     >
//                         <img src={movie.poster_url} alt={movie.title} />
//                         <p>{movie.title}</p>
//                     </Link>
//                 ))}
//             </div>

//         </section>
//     </main>
    
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

export default function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSeries() {
      try {
        console.log("Fetching series...");
        const res = await fetch("http://localhost:8008/seriesonly");
        console.log("Response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Series data received:", data);
          
          // The response should have a 'series' property based on SeriesListResponse model
          if (data.series) {
            setSeries(data.series);
          } else {
            // Fallback if the structure is different
            setSeries(data);
          }
        } else {
          console.error("Failed to fetch series, status:", res.status);
          setError(`Failed to load series: ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching series:", error);
        setError("Error fetching series: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSeries();
  }, []);

  if (loading) {
    return (
      <main className={styles.fullContainer}>
        <section className={styles.genreSection}>
          <h2>Series</h2>
          <div className={styles.loading}>Loading series...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.fullContainer}>
        <section className={styles.genreSection}>
          <h2>Series</h2>
          <div className={styles.error}>{error}</div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.fullContainer}>
      <section className={styles.genreSection}>
        <h2>Series</h2>
        <div className={styles.moviesGrid}>
          {series.map((seriesItem, index) => (
            <Link
              key={`${seriesItem.id}-${index}`}
              href={`/series/${seriesItem.id}`}
              className={styles.movieCard}
            >
              <img 
                src={seriesItem.poster_url || '/placeholder-poster.jpg'} 
                alt={seriesItem.title} 
                onError={(e) => {
                  e.target.src = '/placeholder-poster.jpg';
                }}
              />
              <p>{seriesItem.title}</p>
              <div className={styles.seriesInfo}>
                <span>S: {seriesItem.total_seasons || 1}</span>
                <span>E: {seriesItem.total_episodes || 1}</span>
              </div>
            </Link>
          ))}
        </div>
        {series.length === 0 && (
          <div className={styles.noSeries}>
            No series found. Make sure you have created series in the backend.
          </div>
        )}
      </section>
    </main>
  );
}