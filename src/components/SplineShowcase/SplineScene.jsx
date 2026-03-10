'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="spline-loader">
      <div className="spline-loader-spinner" />
    </div>
  ),
});

export default function SplineScene({ scene, className = '', style = {} }) {
  return <Spline scene={scene} className={className} style={style} />;
}
