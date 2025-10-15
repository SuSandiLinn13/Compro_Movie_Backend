// app/topimdb/page.js
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

const TopIMDbPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:8008/movies");
        const data = await res.json();

        const moviesArray = Array.isArray(data) ? data : data.movies;
        if (!Array.isArray(moviesArray)) {
          console.error("Movies data is not an array:", data);
          setMovies([]);
          setLoading(false);
          return;
        }

        // Sort by IMDb rating descending
        const sortedMovies = moviesArray.sort(
          (a, b) => b.imdb_rating - a.imdb_rating
        );

        setMovies(sortedMovies);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading movies...</p>;

  const topThree = movies.slice(0, 3);
  const others = movies.slice(3);

  const sections = [
    { title: "Top 3 IMDb Ranking", movies: topThree },
    { title: "Other Movies", movies: others },
  ];

  return (
    <main className={styles.fullContainer}>
      {sections.map((section) => (
        <section key={section.title} className={styles.genreSection}>
          <h2>{section.title}</h2>
          <div className={styles.moviesGrid}>
            {section.movies.map((movie, index) => (
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
  );
};


export default TopIMDbPage;
