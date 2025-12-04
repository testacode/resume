import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { resumeData } from '@/data/resume';

export default function Home() {
  const { personal, experience } = resumeData;

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero data={personal} />
        <About data={personal} />
        <Experience data={experience} />
      </main>
      <Footer social={personal.social} name={personal.name} />
    </>
  );
}
