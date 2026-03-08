import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineScene({ scene, className = '', style = {} }) {
  return (
    <Suspense
      fallback={
        <div className="spline-loader">
          <div className="spline-loader-spinner" />
        </div>
      }
    >
      <Spline scene={scene} className={className} style={style} />
    </Suspense>
  );
}
