import type { RouteRecord } from 'vite-react-ssg';
import RootLayout from './layouts/RootLayout';
import { getCategoryPaths, getAllPostPaths } from './lib/content';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    // Declaring the entry keeps the layout's CSS in the initial HTML (no FOUC).
    entry: 'src/layouts/RootLayout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Landing') },
      { path: 'blog', lazy: () => import('./pages/blog/BlogIndex') },
      {
        path: 'blog/:category',
        lazy: () => import('./pages/blog/CategoryPage'),
        getStaticPaths: () => getCategoryPaths(),
      },
      {
        path: 'blog/:category/:slug',
        lazy: () => import('./pages/blog/PostPage'),
        getStaticPaths: () => getAllPostPaths(),
      },
      // Pre-rendered 404 page; postbuild copies it to dist/404.html for GitHub Pages.
      { path: '404', lazy: () => import('./pages/NotFound') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
];
