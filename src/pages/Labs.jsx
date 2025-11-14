import Navbar from "../components/Navbar";
import SkillShowcases from "../components/SkillShowcases";
import AISandboxLab from "../components/AISandboxLab";
import CloudOpsLab from "../components/CloudOpsLab";
import DevSecOpsLab from "../components/DevSecOpsLab";
import InclusiveDesignLab from "../components/InclusiveDesignLab";
import EnablementLab from "../components/EnablementLab";
import DataStorytellingLab from "../components/DataStorytellingLab";
import Contact from "../components/Contact";

const LabsPage = () => {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-purple-300">
          Labs Hub
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Full Case Studies & Demos
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          Dive into the full-length interactive labs that were only previewed on the
          homepage—complete walkthroughs, dashboards, and documentation.
        </p>
      </section>
      <SkillShowcases />
      <AISandboxLab />
      <CloudOpsLab />
      <DevSecOpsLab />
      <InclusiveDesignLab />
      <EnablementLab />
      <DataStorytellingLab />
      <Contact />
    </>
  );
};

export default LabsPage;

