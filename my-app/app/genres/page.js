// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import styles from "../page.module.css";

// export default function GenresPage() {
//   const [genres, setGenres] = useState([]);
//   const [moviesByGenre, setMoviesByGenre] = useState({});

//   // Fetch all genres
//   useEffect(() => {
//     async function fetchGenres() {
//       try {
//         const res = await fetch("http://localhost:8008/genres"); 
//         const data = await res.json();
//         setGenres(data);
//       } catch (err) {
//         console.error("Failed to fetch genres:", err);
//       }
//     }
//     fetchGenres();
//   }, []);

//   // Fetch all movies and group by genre
//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//         const res = await fetch("http://localhost:8008/movies"); 
//         const data = await res.json();
//         // Group movies by genre
//         const grouped = {};
//         data.movies.forEach((movie) => {
//           movie.genre.forEach((g) => {
//             if (!grouped[g]) grouped[g] = [];
//             grouped[g].push(movie);
//           });
//         });
//         setMoviesByGenre(grouped);
//       } catch (err) {
//         console.error("Failed to fetch movies:", err);
//       }
//     }
//     fetchMovies();
//   }, []);

//   // Scroll to a genre section
//   const scrollToGenre = (genre) => {
//     const element = document.getElementById(genre);
//     if (element) element.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <h2>Genres</h2>
//         <ul>
//           {genres.map((genre) => (
//             <li key={genre} onClick={() => scrollToGenre(genre)}>
//               {genre}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <main className={styles.mainContent}>
//         {genres.map((genre) => (
//           <section key={genre} id={genre} className={styles.genreSection}>
//             <h2>{genre} Movies</h2>
//             <div className={styles.moviesGrid}>
//               {moviesByGenre[genre]?.map((movie) => (
//                 <Link
//                   key={movie.movie_id}
//                   href={`/movies/${movie.movie_id}`}
//                   className={styles.movieCard}
//                 >
//                   <img src={movie.poster_url} alt={movie.title} />
//                   <p>{movie.title}</p>
//                 </Link>
//               ))}
//             </div>
//           </section>
//         ))}
//       </main>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "../page.module.css";
import { Typography, CircularProgress } from '@mui/material';

export default function GenresPage() {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Scroll to genre section
  const scrollToGenre = (genre) => {
    const element = document.getElementById(genre);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchGenresAndMovies() {
      try {
        const genresRes = await fetch('http://localhost:8008/genres');
        const genresData = await genresRes.json();
        setGenres(genresData);

        const moviesDataByGenre = {};
        for (const genre of genresData) {
          const res = await fetch(`http://localhost:8008/genres/${genre}`);
          if (res.ok) {
            const data = await res.json();
            moviesDataByGenre[genre] = data.movies;
          } else {
            moviesDataByGenre[genre] = [];
          }
        }

        setMoviesByGenre(moviesDataByGenre);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGenresAndMovies();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 5, ml: 5 }} />;
  if (error) return <Typography sx={{ mt: 5 }} color="error">Failed to load genres.</Typography>;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>Genres</h2>
        <ul>
          {genres.map((genre) => (
            <li key={genre} onClick={() => scrollToGenre(genre)}>
              {genre}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {genres.map((genre) => (
          <section key={genre} id={genre} className={styles.genreSection}>
            <h2>{genre} Movies</h2>
            <div className={styles.moviesGrid}>
              {moviesByGenre[genre]?.map((movie, index) => (
                <Link
                  key={`${movie.id}-${index}`} 
                  href={`/movies/${movie.id}`}
                  className={styles.movieCard}
                >
                  <img src={movie.poster_url} alt={movie.title} />
                  <p>{movie.title}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
