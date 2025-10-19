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
