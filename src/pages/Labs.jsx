import { useEffect } from "react";
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Navbar />
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

