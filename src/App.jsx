import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Authority from './components/Authority/Authority';
import SplineShowcase from './components/SplineShowcase/SplineShowcase';
import Expertise from './components/Expertise/Expertise';
import Results from './components/Results/Results';
import Process from './components/Process/Process';
import About from './components/About/About';
import ParticleInterlude from './components/ParticleInterlude/ParticleInterlude';
import Testimonial from './components/Testimonial/Testimonial';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import CursorGlow from './components/CursorGlow/CursorGlow';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  useScrollReveal();

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Authority />
        <SplineShowcase />
        <Expertise />
        <Results />
        <Process />
        <About />
        <ParticleInterlude />
        <Testimonial />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
