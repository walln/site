import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import { Switch } from '@headlessui/react';

export default function Container(props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const { children, ...customMeta } = props;
  const router = useRouter();
  const meta = {
    title: 'Nick Wall',
    description: `Full-stack developer and Machine Learning/AI enthusiast.`,
    type: 'website',
    ...customMeta
  };

  return (
    <div className="bg-white dark:bg-custom-dark h-screen">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`https://walln.dev${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Nick Wall" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nickwal" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && <meta property="article:published_time" content={meta.date} />}
      </Head>
      <nav className="sticky-nav flex justify-between items-center max-w-4xl w-full p-8 my-0 md:my-8 mx-auto bg-white dark:bg-custom-dark bg-opacity-60">
        {mounted && (
          <Switch
            checked={theme === 'dark'}
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-200'
            } relative inline-flex h-4 rounded-full w-8`}
          >
            <span
              className={`${
                theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
              } inline-block w-4 h-4 transform bg-black dark:bg-gray-500 rounded-full`}
            />
          </Switch>
        )}

        <div>
          <NextLink href="/">
            <a className="p-1 sm:p-2 text-gray-900 dark:text-gray-100">Home</a>
          </NextLink>
          <NextLink href="/about">
            <a className="p-1 sm:p-2 text-gray-900 dark:text-gray-100">About</a>
          </NextLink>
          <NextLink href="/projects">
            <a className="p-1 sm:p-2 text-gray-900 dark:text-gray-100">Projects</a>
          </NextLink>
          <a
            className="p-1 sm:p-2 text-gray-900 dark:text-gray-100"
            target="_blank"
            rel="noopener noreferrer"
            href="/static/resume.pdf"
          >
            Resume
          </a>
        </div>
      </nav>
      <main id="skip" className="flex flex-col justify-center bg-white dark:bg-custom-dark px-8">
        {children}
      </main>
    </div>
  );
}
