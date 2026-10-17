import React, { useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProofStrip from './components/ProofStrip';
import SelectedWork from './components/SelectedWork';
import Experience from './components/Experience';
import AlsoBuilt from './components/AlsoBuilt';
import Expertise from './components/Expertise';
import LatestThinking from './components/LatestThinking';
import Certifications from './components/Certifications';
import BTS from './components/BTS';
import Contact from './components/Contact';
import CaseStudyPage from './components/CaseStudyPage';
import { usePath } from './router';
import { CASE_STUDY_PAGES } from './constants';
import { trackPageView } from './lib/analytics';

function App() {
  const path = usePath();

  const slug = path.startsWith('/work/') ? path.replace('/work/', '') : null;
  const isWork = Boolean(slug && CASE_STUDY_PAGES.some((c) => c.slug === slug));

  /*
   * Route change is the only place a "view" can be measured, because the
   * site navigates on the client without a page load. Case study routes are
   * labelled as such by the tracking endpoint, so nothing here needs to know
   * the difference between a case study and any other route.
   */
  useEffect(() => {
    trackPageView(path);
  }, [path]);

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#1C1C1C] antialiased selection:bg-[#1C1C1C] selection:text-[#F4F4F0]">
      <CustomCursor />
      <Navbar />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#1C1C1C] focus:text-[#F4F4F0] focus:rounded-full focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a>

      {isWork ? (
        <CaseStudyPage slug={slug as string} />
      ) : (
        <>
          <main id="main">
            <Hero />
            <ProofStrip />
            <SelectedWork />
            <Experience />
            <Expertise />
            <AlsoBuilt />
            <LatestThinking />
            <Certifications />
            <BTS />
          </main>
          <Contact />
        </>
      )}
    </div>
  );
}

export default App;
