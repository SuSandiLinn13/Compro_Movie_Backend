"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch("http://localhost:8008/seriesonly");
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    }
    fetchMovies();
  }, []);

  return (
    <main className={styles.fullContainer}>
        <section className={styles.genreSection}>
            <h2>Series</h2>
            <div className={styles.moviesGrid}>
                {movies.map((movie, index) => (
                    <Link
                    key={`${movie.movie_id}-${index}`}
                    href={`/movies/${movie.movie_id}`}
                    className={styles.movieCard}
                    >
                        <img src={movie.poster_url} alt={movie.title} />
                        <p>{movie.title}</p>
                    </Link>
                ))}
            </div>

        </section>
    </main>
    
  );
}


    