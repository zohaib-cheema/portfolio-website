import bucknellLogo from "../assets/Bucknell.png";
import idtechLogo from "../assets/idtech.png";
import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import uberLogo from "../assets/uber.png";

export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 5 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `Hi! I’m Zohaib (Zo-hey-b), a Computer Science and Math student passionate about using technology to solve real-world problems. Growing up in a resource-limited community taught me to think creatively and stay solution-focused. I’ve interned at companies like Uber, led 3 student organizations, organized 20+ events, and managed student group finances. With over 180 volunteer hours teaching coding to students and underserved communities, I’m dedicated to expanding STEM access. I’ve built 50+ technical projects, and outside tech, I choreograph and dance to express creativity and leadership. Let’s connect: zohaib.s.cheema92@gmail.com.`;

export const EXPERIENCES = [
  {
    year: "May 2024 – Aug 2024",
    role: "Software Engineer Intern",
    company: "Uber",
    logo: uberLogo,
    description: `Improved order accuracy by 27% for 200 Uber Eats merchants and boosted Uber One adoption across 9 countries (10M users) by architecting a real-time Kafka-FlinkSQL-Pinot pipeline and building a validated migration system with A/B-tested Go/TypeScript rollouts.`,
    technologies: ["Kafka", "FlinkSQL", "Go", "Typescript", "Pinot"],
  },
  {
    year: "Dec 2024 – May 2025",
    role: "Software Engineer Intern",
    company: "iD Tech",
    logo: idtechLogo,
    description: `Taught 70+ students DSA in Python and AI chatbot development, and led workshops on building multi-agent GPT-3.5/Microsoft AutoGen chatbots to generate and debug Gurobi code for supply chain optimization.`,
    technologies: ["Python", "AI", "GPT-3.5", "Microsoft AutoGen", "Gurobi"],
  },
  {
    year: "Aug 2023 – April 2024",
    role: "Full-Stack Software Engineer Intern",
    company: "Bucknell L&IT Services",
    logo: bucknellLogo,
    description: `Reduced manual record-keeping by over 40% by building a React-based dashboard for L&IT Equipment Services to track 1,200+ devices, integrating live PostgreSQL data and custom Node.js APIs for inventory summaries, overdue flags, and activity logs.`,
    technologies: ["React", "PostgreSQL", "Node.js", "RESTful API"],
  },
];


export const PROJECTS = [
  {
    title: "PayPie",
    image: project2,
    description:
      "PayPie is a web app designed to simplify expense splitting for groups, whether for travel, shared living, or collaborative projects. With features like smart cost splitting, real-time updates, and receipt scanning, PayPie streamlines the process of managing and settling group finances.",    technologies: ["React", "Next.js", "Firebase", "AWS Lambda", "Gemini Gen AI"],
  },
  {
    title: "AwareNest",
    image: project1,
    description:
      "AwareNest is a mental health app designed to help users track their emotional well-being, log moods, and access mindfulness content. The app uses personalized emotion analysis to provide targeted suggestions and improve mental health tracking over time.",    technologies: ["Dart", "MySQL", "C++"],
  },
  {
    title: "DeFacto",
    image: project3,
    description:
      "DeFacto is a machine learning-based tool that classifies fake news articles using a hybrid model built with Scikit-learn, TensorFlow, and Keras. The system analyzes social and political content to detect deception in news stories and social media posts, providing a reliable solution to address the growing issue of misinformation.",
    technologies: ["Scikit-learn", "TensorFlow", "Keras", "R", "Pandas", "NumPy"],
  },
];


export const CONTACT = {
  address: "140 North Clinton Ave, Bay Shore, NY 11706 ",
  phoneNo: "+1 619-897-5041 ",
  email: "zohaib.s.cheema9@gmail.com",
};
