"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import styles from "./page.module.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const router = useRouter();
  const [currentBg, setCurrentBg] = useState(0);

  const heroImages = [
    "https://www.saadtraderspk.com/media/photos/stationary/banner.webp",
    "https://cdn.stories.shwmx.co/media/2020/06/bg-challenger-scaled.jpg",
    "https://mobilevikings.be/content/uploads/2022/03/bg-streamz-lp-1.jpeg",
    "https://analyticsindiamag.com/wp-content/uploads/2019/05/apps.55787.9007199266246365.687a10a8-4c4a-4a47-8ec5-a95f70d8852d.jpg"
  ];

  // --- Fetch Movies ---
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("http://localhost:8008/movies");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setMovies(data);
          else if (Array.isArray(data.movies)) setMovies(data.movies);
          else if (Array.isArray(data.movie_detail)) setMovies(data.movie_detail);
          else setMovies([]);
        } else console.error("Failed to fetch movies");
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    }
    fetchMovies();
  }, []);

  // --- Hero background slideshow ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

// --- Login Token ---
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // User is logged in → redirect to /home
    router.replace("/home");
  }
}, []);


  return (
    <main className={styles.homeContainer}>
      {/* Hero Section */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImages[currentBg]})` }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroText}>
            <h1>You Were Here is a place for all movie lovers.</h1>
            <p>Watch now with your own account!</p>
            <div className={styles.buttonGroup}>
              <Button variant="contained" color="primary" href="/login">
                Log in
              </Button>
              <Button variant="contained" color="secondary" href="/register">
                Register
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className={styles.trending}>
        <h2>Trending Movies and Series</h2>
        <div className={styles.moviesGrid}>
          {movies.map((movie, index) => (
            <Link
              key={`${movie.id || movie.movie_id}-${index}`}
              href={`/movies/${movie.id || movie.movie_id}`}
              className={styles.movieCard}
            >
              <img src={movie.poster_url} alt={movie.title} />
              <p>{movie.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <div className={styles.contactContainer}>
          <h2>Contact Us</h2>
          <p>We’d love to hear from you! Reach out to us anytime.</p>
          <div className={styles.contactDetails}>
            <div>
              <EmailOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <p>youwerehere@gmail.com</p>
            </div>
            <div>
              <ContactPhoneOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <p>+123 456 7890</p>
            </div>
            <div>
              <HomeOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <p>Latkra Bang, Bangkok</p>
            </div>
          </div>
          <p className={styles.footerNote}>
            © {new Date().getFullYear()} You Were Here. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
