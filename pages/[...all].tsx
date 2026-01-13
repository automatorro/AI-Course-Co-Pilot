import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContent } from '../src/App';
import Head from 'next/head';

const AppCatchAll = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
        <Head>
            <meta name="robots" content="noindex" />
        </Head>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
    </>
  );
};

export default AppCatchAll;
