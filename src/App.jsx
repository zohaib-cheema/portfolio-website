import { Routes, Route, useLocation } from "react-router-dom";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Technologies from "./components/Technologies";
import TechStack from "./components/TechStack";
import Leadership from "./components/Leadership";
import TraitsConvergence from "./components/TraitsConvergence";
import Chatbot from "./components/Chatbot";
import Calendar from "./pages/Calendar";
import Feedback from "./pages/Feedback";
import ScrollProgress from "./components/ScrollProgress";
import SkillLabsPreview from "./components/SkillLabsPreview";
import ArtifactPreview from "./components/ArtifactPreview";
import LabsPage from "./pages/Labs";
import ArtifactsPage from "./pages/Artifacts";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TraitsConvergence />
      <Experience />
      <Leadership />
      <SkillLabsPreview />
      <TechStack />
      <ArtifactPreview />
      <Projects />
      <Contact />
    </>
  );
};

const App = () => {
  const location = useLocation();
  const showChatbot = location.pathname === '/';

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <ScrollProgress />
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container mx-auto px-8">
              <HomePage />
            </div>
          }
        />
        <Route
          path="/labs"
          element={
            <div className="container mx-auto px-8">
              <LabsPage />
            </div>
          }
        />
        <Route
          path="/artifacts"
          element={
            <div className="container mx-auto px-8">
              <ArtifactsPage />
            </div>
          }
        />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>

      {/* Chatbot - only show on main page */}
      {showChatbot && <Chatbot />}
    </div>
  );
};

export default App;