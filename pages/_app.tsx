import { ThemeProvider } from 'next-themes';
import { AnimatePresence } from 'framer-motion';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} />
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default MyApp;
