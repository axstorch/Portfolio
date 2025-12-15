import React from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LinkedInSection from './components/LinkedInSection';
import Projects from './components/Projects';
import BTSSection from './components/BTSSection';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';
import Certifications from './components/Certifications';

function App() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#1C1C1C] selection:bg-[#1C1C1C] selection:text-[#F4F4F0]">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <LinkedInSection />
        <Projects />
        <BTSSection />
        <Experience />
        <Certifications />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
