import React from 'react';
import { Suspense,lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SuspenseBlink from './SuspenseBlink';
import LandingPageSuspense from './LandingPageSuspense';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const LazyLoadApp = React.lazy(() => import('./App'));
root.render(
  <Suspense fallback={<LandingPageSuspense />}>
    <LazyLoadApp />
  </Suspense>

  // <App />
);


reportWebVitals();
