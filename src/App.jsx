import { data } from "./resumeData";
import About from "./Pages/About";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Resume from "./Components/Resume";
import posthog from "posthog-js";

posthog.init("phc_iYfBlgEMYTi4ytOSWKz5he0PxrS20tIbM8V0ilvAiS0", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "always", // or 'always' to create profiles for anonymous users as well
});

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
