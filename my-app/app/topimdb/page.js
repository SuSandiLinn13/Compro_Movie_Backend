"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css";

const TopIMDbPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const moviesRes = await fetch("http://localhost:8008/movies");
        const moviesData = await moviesRes.json();
        const moviesArray = Array.isArray(moviesData) ? moviesData : moviesData.movies || [];

        const seriesRes = await fetch("http://localhost:8008/series");
        const seriesData = await seriesRes.json();
        const seriesArray = Array.isArray(seriesData) ? seriesData : seriesData.series || [];

        const combined = [...moviesArray, ...seriesArray];
        combined.sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0));

        setContent(combined);
      } catch (err) {
        console.error("Failed to fetch content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Loading content...</p>;

  const topFive = content.slice(0, 5);
  const others = content.slice(5);

  const sections = [
    { title: "Top 5 IMDb Ranking", movies: topFive},
    { title: "Other Movies & Series", movies: others },
  ];

  return (
    <main className={styles.fullContainer}>
      {sections.map((section) => (
        <section key={section.title} className={styles.genreSection}>
          <h2>{section.title}</h2>
          <div className={styles.moviesGrid}>
            {section.movies.map((item, index) => (
              <Link
                key={`${item.id || item.series_id}-${index}`}
                href={`/${item.total_seasons ? "series" : "movies"}/${item.id || item.series_id}`}
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
  );
};

export default TopIMDbPage;
