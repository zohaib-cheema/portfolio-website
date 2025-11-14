import Navbar from "../components/Navbar";
import ArtifactLibrary from "../components/ArtifactLibrary";
import Contact from "../components/Contact";

const ArtifactsPage = () => {
  return (
    <>
      <Navbar />
      <section className="pt-28 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
          Artifact Library
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
          Downloadable Proof
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          Every runbook, audit, and toolkit in one place—grab the files recruiters
          ask for when they want tangible evidence.
        </p>
      </section>
      <ArtifactLibrary />
      <Contact />
    </>
  );
};

export default ArtifactsPage;

