import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/next';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { I18nProvider } from '../src/contexts/I18nContext';
import { ToastProvider } from '../src/contexts/ToastProvider';
import HeaderNext from '../src/components/HeaderNext';
import FooterNext from '../src/components/FooterNext';
import '../src/index.css';
import '../src/styles/sticky-editor.css';
import 'highlight.js/styles/github.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAppRoute = router.pathname === '/[...all]';
  const isWorkspaceRoute = router.pathname.startsWith('/course/');

  return (
    <I18nProvider initialTranslations={pageProps.initialTranslations}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <HelmetProvider>
              {isAppRoute ? (
                <Component {...pageProps} />
              ) : (
                <div className="min-h-screen flex flex-col premium-texture bg-ink-50 dark:bg-ink-900 text-ink-900 dark:text-ink-100 transition-colors duration-300">
                  {!isWorkspaceRoute && <HeaderNext />}
                  <main className={isWorkspaceRoute ? 'flex-grow' : 'pt-16 flex-grow'}>
                     <Component {...pageProps} />
                  </main>
                  {!isWorkspaceRoute && <FooterNext />}
                </div>
              )}
              <Analytics />
            </HelmetProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default MyApp;
