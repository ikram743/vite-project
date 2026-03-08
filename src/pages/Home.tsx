import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import ForWhom from '../components/ForWhom';
import Impact from '../components/Impact';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <section id="how">      {/* أضف id هنا */}
        <HowItWorks />
      </section>
      <section id="whom">      {/* أضف id هنا */}
        <ForWhom />
      </section>
      <section id="impact">    {/* أضف id هنا */}
        <Impact />
      </section>
      <CTA />
      <Footer />
    </>
  );
};

export default Home;