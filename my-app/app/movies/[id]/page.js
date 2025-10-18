'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Chip } from '@mui/material';

export default function MovieProfilePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return; // wait for id

    async function fetchMovie() {
      try {
        const movieId = parseInt(id, 10);
        if (isNaN(movieId)) throw new Error('Invalid movie ID');

        const res = await fetch(`http://localhost:8008/movie/${movieId}`);
        if (!res.ok) throw new Error('Movie not found');

        const data = await res.json();
        setMovie(data.movie_detail);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 5, ml: 5 }} />;
  if (error || !movie) return <Typography sx={{ mt: 5 }} color="error">Movie not found</Typography>;

  return (
    <Box sx={{ maxWidth: "100%", mx: 'auto', mt: 12, px: 3, padding: "6rem 6rem", marginTop: '40px', 
       display: 'flex', flexWrap: 'wrap', gap: 4, 
      backgroundColor: '#1e1e1e', color: '#fff' }}>
      {/* Poster + Watch Now Button */}
      <Box sx={{ minWidth: 300, flexShrink: 0 }}>
        <Box
          component="img"
          src={movie.poster_url}
          alt={movie.title}
          sx={{ width: 300, borderRadius: 2, mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '70%' }}
          onClick={() => window.open('https://www.youtube.com/', '_blank')} // replace '#' with youtube link later
        >
          Watch Now
        </Button>
      </Box>

      {/* Movie Details */}
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {Array.isArray(movie.genre) && movie.genre.map((g) => (
            <Chip key={g} label={g} color="primary" />
          ))}
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Director:</strong> {movie.director || 'Unknown'}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Casts:</strong> {Array.isArray(movie.casts) ? movie.casts.join(', ') : movie.casts || 'Unknown'}
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>IMDB Rating:</strong> {' '}
           {movie.imdb_rating !== null && movie.imdb_rating !== undefined? movie.imdb_rating.toFixed(1): 'Unknown'}
      </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {movie.description || 'No description available.'}
        </Typography>
      </Box>
    </Box>
  );
}