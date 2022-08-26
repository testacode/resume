import { data } from './resumeData';
import About from './Components/About';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Resume from './Components/Resume';

const App = () => {
  return (
    <div className="App">
      <Header data={data.main} />
      <About data={data.main} />
      <Resume data={data.resume} />
      <Footer data={data.main} />
    </div>
  );
};

export default App;
