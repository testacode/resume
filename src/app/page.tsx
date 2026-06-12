import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { resumeData } from '@/data/resume';

export default function Home() {
  const { personal, experience, projects, education } = resumeData;

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero data={personal} />
        <About data={personal} />
        <Experience data={experience} />
        <Projects data={projects} />
        <Education data={education} />
      </main>
      <Footer social={personal.social} name={personal.name} />
    </>
  );
}
