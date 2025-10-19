'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "../page.module.css";
import { Typography, CircularProgress } from '@mui/material';

export default function GenresPage() {
  const [contentByGenre, setContentByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Scroll to genre section
  const scrollToGenre = (genre) => {
    const element = document.getElementById(genre);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchGenresAndContent() {
      try {
        // Fetch genres
        const genresRes = await fetch('http://localhost:8008/genres');
        const genresData = await genresRes.json();
        setGenres(genresData);

        const genreContentMap = {};

        // Fetch movies and series by genre
        for (const genre of genresData) {
          // Movies
          const moviesRes = await fetch(`http://localhost:8008/genres/${genre}`);
          const moviesData = moviesRes.ok ? await moviesRes.json() : { movies: [] };

          // Series
          const seriesRes = await fetch(`http://localhost:8008/series/genre/${genre}`);
          const seriesData = seriesRes.ok ? await seriesRes.json() : { series: [] };

          // Merge movies and series
          genreContentMap[genre] = [
            ...(moviesData.movies || []),
            ...(seriesData.series || [])
          ];
        }

        setContentByGenre(genreContentMap);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGenresAndContent();
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
            <h2>{genre}</h2>
            <div className={styles.moviesGrid}>
              {contentByGenre[genre]?.map((item, index) => (
                <Link
                  key={`${item.total_seasons ? 'series' : 'movie'}-${item.id || item.series_id}-${index}`}
                  href={`/${item.total_seasons ? 'series' : 'movies'}/${item.id || item.series_id}`}
                  className={styles.movieCard}
                >
                  <img src={item.poster_url} alt={item.title} />
                  <p>{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
