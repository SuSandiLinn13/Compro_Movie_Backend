'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Create a base theme (you can customize colors here)
const theme = createTheme({
  palette: {
    primary: { main: '#6750A4' },
    background: { default: '#fff' },
  },
});

export default function ThemeRegistry({ children }) {
  const cache = React.useMemo(() => createCache({ key: 'mui', prepend: true }), []);

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(' '),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
