import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";

export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 5 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `Hi! I’m Zohaib (Zo-hey-b), a Computer Science and Math student passionate about using technology to solve real-world problems. Growing up in a resource-limited community taught me to think creatively and stay solution-focused. I’ve interned at companies like Uber, led 3 student organizations, organized 20+ events, and managed student group finances. With over 180 volunteer hours teaching coding to students and underserved communities, I’m dedicated to expanding STEM access. I’ve built 50+ technical projects, and outside tech, I choreograph and dance to express creativity and leadership. Let’s connect: zohaib.s.cheema92@gmail.com.`;

export const EXPERIENCES = [
  {
    year: "Sep 2023 – Present",
    role: "Software Engineering Instructor",
    company: "iD Tech",
    description: `Spearheaded instruction for 70+ students in Python, Java, ML, and AI development using TensorFlow and OpenAI. Built project-based modules that improved debugging efficiency by 34% and raised proficiency and satisfaction scores.`,
    technologies: ["Python", "Java", "TensorFlow", "OpenAI", "ML", "AI"],
  },
  {
    year: "May 2024 – Aug 2024",
    role: "Software Engineer Intern",
    company: "Uber",
    description: `Developed a Go/TypeScript project converting 10M users to Uber One across 9 countries with A/B testing and UI/UX improvements. Enhanced UberEats merchant tools using Apache Pinot and Hive, and built a Go API for promotion code validation using SQL and Kafka.`,
    technologies: ["Go", "TypeScript", "A/B Testing", "UI/UX", "SQL", "Kafka", "Hive", "Apache Pinot"],
  },
  {
    year: "Aug 2023 – Apr 2024",
    role: "Full-Stack Software Engineer Intern",
    company: "Bucknell L&IT Services",
    description: `Built and launched a full-stack library web app using React, Node, Tailwind CSS, and Firebase for 4000+ users. Designed a PostgreSQL database with REST APIs to manage inventory and user data, reducing manual tasks by 40%.`,
    technologies: ["React", "Node", "Tailwind CSS", "Firebase", "PostgreSQL", "REST APIs"],
  },
  {
    year: "May 2023 – Aug 2023",
    role: "App Development Intern",
    company: "PA Small Business Development Center",
    description: `Created an iOS app for a local bakery using Swift and Figma, streamlining order flow and reducing wait times by 35%. Integrated MongoDB to manage orders and inventory, saving 10+ hours of manual tracking weekly.`,
    technologies: ["iOS", "Swift", "Figma", "MongoDB"],
  },
];


export const PROJECTS = [
  {
    title: "AwareNest",
    image: project1,
    description:
      "Created a mental health app with Dart and MySQL, letting users log moods, access content, and track emotional trends. Integrated a C++ backend for offline emotion analysis, enhancing response time and personalized recommendations.",
    technologies: ["Dart", "MySQL", "C++"],
    link: "https://github.com/yourusername/awarenest",
  },
  {
    title: "PayPie",
    image: project2,
    description:
      "Built a full-stack expense splitter with React, Next.js, Firebase, and AWS Lambda for receipt parsing and cost splits. Used Gemini Gen AI for automated expense summary and Git for efficient version control and team collaboration.",
    technologies: ["React", "Next.js", "Firebase", "AWS Lambda", "Gemini Gen AI"],
    link: "https://github.com/yourusername/paypie",
  },
  {
    title: "DeFacto",
    image: project3,
    description:
      "Built a hybrid fake news classifier using Scikit-learn, TensorFlow, and Keras to analyze social and political content. Preprocessed data and engineered features with R, Pandas, and NumPy, enhancing model accuracy and reliability.",
    technologies: ["Scikit-learn", "TensorFlow", "Keras", "R", "Pandas", "NumPy"],
    link: "https://github.com/yourusername/defacto",
  },
];


export const CONTACT = {
  address: "140 North Clinton Ave, Bay Shore, NY 11706 ",
  phoneNo: "+1 619-897-5041 ",
  email: "zohaib.s.cheema92@gmail.com",
};
