import { ExperienceItem, ProjectItem, SkillCategory, LinkedInPost, BTSImage } from './types';

export const RESUME_DATA = {
  name: "Akshat Saxena",
  title: "Product Management Intern | React & Supabase Developer",
  email: "akshatsaxena7974@gmail.com",
  phone: "+91 7974920243",
  location: "Hyderabad, Telangana, India",
  linkedin: "https://www.linkedin.com/in/akshat-saxena-5513a8258",
  Github: "https://github.com/axstorch",
  Resune: "https://drive.google.com/file/d/1Ye-W37kHNLRmzGtryg6cORLl_PxkkdRH/view?usp=drive_link",
  summary: "As a proactive and results-driven final-year student, I thrive on building impactful tech solutions using React, Supabase, and React frameworks such as Expo and Native. With a growing interest in product management, I aim to bridge the gap between user needs and tech solutions, transforming innovative concepts into market-ready products.",
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "1",
    role: "Strategy Consultant Intern",
    company: "SOR Informatics",
    period: "June 2025 - September 2025",
    location: "Hyderabad, India",
    description: [
      "Product & Competitive Analysis: Led structured competitor and feature-gap analyses for 4 client products, directly informing roadmap priorities and product positioning decisions.",
      "Cross-Functional Execution: Acted as a coordination bridge between field teams and leadership, synthesizing updates from 6 on-ground associates into clear, decision-ready insights.",
      "User & Market Research: Designed and executed targeted market and user research across 3 engagements, translating insights into actionable recommendations for product and growth strategy.",

    ]
  },
  {
    id: "2",
    role: "Senior Marketing Executive",
    company: "FED KIIT",
    period: "August 2024 - September 2025",
    location: "Bhubaneswar, India",
    description: [
      "Go-to-Market Execution: Led on-ground acquisition and engagement initiatives that increased student participation by 15%, driving 200+ active attendees.",
      "Program & Event Ownership: Owned end-to-end planning and execution of OMEGA, scaling attendance to 330+ participants and improving turnout by 30% over previous editions.",
      "Operational Optimization: Partnered with a 12-member cross-functional team to streamline event logistics, reducing setup time by 20% and improving execution efficiency."
    ]

  },
  {
    id: "3",
    role: "Intern",
    company: "Arrka",
    period: "June 2024 - June 2024",
    location: "Remote",
    description: [
      "Managed 5000+ Cybersecurity data points with a 97% accuracy rate.",
      "Led creation of 6+ security policy documents, reducing incident resolution time by 23%."
    ]
  }
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "p1",
    title: "Crave",
    description: "A fully functional cross-platform app designed to streamline food court experiences. Focuses on reducing wait times and boosting revenue for our.",
    technologies: ["User research", "Market analysis", "Wireframing", "Agile Methodology", "UX understanding"],
    image: "/assets/linkedin/LOGO.jpg",
    imagePlaceholder: "bg-stone-300",
    url: "https://github.com/axstorch/foodcourt-expo"
  },
  {
    id: "p2",
    title: "WeatherForU",
    description: "A dynamic weather dashboard deployed for real-time updates. Features intuitive data visualization for climatic conditions.",
    technologies: ["Agile Mgmt", "API Integration", "AI", "UX"],
    image: "/assets/linkedin/Project2.png",
    imagePlaceholder: "bg-stone-400",
    url: "https://weatherfor-u.vercel.app/"
  }
];

export const LINKEDIN_POSTS = [
  {
    id: '7402742225333338112',
    title: 'Driving adoption with the help of cute balloons and bracelets',
    excerpt:
      'I noticed a marketing strategy in my campus that wokred... too well!',
    date: 'Dec 2024',
    likes: 80,
    comments: 12,
    url: 'https://www.linkedin.com/feed/update/urn:li:share:7402742225333338112',
    image: "/assets/linkedin/Post1.png",
  },

  {
    id: '7390306392219291648',
    title: 'Explaining the 4 pillars of OOPS using water bottle?',
    excerpt:
      'How a simple water bottle can help you understand the 4 pillars of OOPS in programming!',
    date: 'Nov 2024',
    likes: 43,
    comments: 9,
    url: 'https://www.linkedin.com/feed/update/urn:li:share:7390306392219291648',
    image: "/assets/linkedin/Post2.png",
  },

  {
    id: '7331336647088713730',
    title: 'A simple weather app using React and OpenWeather API',
    excerpt: 'It was a project and had to be submitted under 4 hours. It does work!',
    date: 'June 2025',
    likes: 57,
    comments: 4,
    url: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7331336647088713730',
    image: "/assets/linkedin/Post4.png",
  },

  {
    id: '7330974262901596163',
    title: 'A brief introduction to CRM systems',
    excerpt: 'Same as title, A brief introduction to CRM systems.',
    date: 'June 2025',
    likes: 26,
    comments: 1,
    url: 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7330974262901596163',
    image: "/assets/linkedin/Post3.png",
  },


];

export const BTS_IMAGES: BTSImage[] = [
  {
    id: "b1",
    caption: "Team at SOR",
    aspectRatio: "landscape",
    image: "/assets/bts/bts1.jpg",
  },
  {
    id: "b3",
    caption: "With the Head of Hospitaltiy (In talks for launching Crave)",
    aspectRatio: "portrait",
    image: "/assets/bts/bts3.jpg",
  },
  {
    id: "b2",
    caption: "probably writing something important",
    aspectRatio: "square",
    image: "/assets/bts/bts2.jpg",
  },

  {
    id: "b4",
    caption: "Appreciation from the team",
    aspectRatio: "square",
    image: "/assets/bts/bts4.jpg",
  },
];


export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Product",
    skills: ["Agile Mgmt", "Requirement Gathering", "User Research", "Competitor Analysis", "Strategy", "Product Roadmapping", "MVP definition", "Wireframing"]
  },
  {
    category: "Technical/Tools",
    skills: ["MySQL", "API Integration", "Data Visualization", "Insight Generation", "Notion", "Canva", "Powerpoint", "Excel", "Python"]
  },
  {
    category: "Leadership",
    skills: ["Collaboration", "Communication", "Leadership", "Problem Solving", "Adaptibility", "Critical Thinking", "Data-driven Approach"]
  }
];

export const SYSTEM_INSTRUCTION = `
You are an AI assistant for Akshat Saxena's portfolio website. You are speaking to a potential recruiter or client.
Your goal is to answer questions about Akshat based strictly on his resume context provided below.
Be professional, enthusiastic, and concise.

Resume Context:
Name: ${RESUME_DATA.name}
Title: ${RESUME_DATA.title}
Contact: ${RESUME_DATA.email}, ${RESUME_DATA.phone}
Location: ${RESUME_DATA.location}

Summary: ${RESUME_DATA.summary}

Experience:
${EXPERIENCE_DATA.map(exp => `- ${exp.role} at ${exp.company} (${exp.period}):\n${exp.description.join('\n')}`).join('\n\n')}

Projects:
${PROJECTS_DATA.map(p => `- ${p.title}: ${p.description} (Tech: ${p.technologies.join(', ')})`).join('\n')}

Education:
- KiiT University: B.Tech in Computer Technology (Aug 2022 - July 2026)
- O.P. Jindal School: Senior Secondary (Math & CS)

Certifications:
- On-Premise DATA Visualization Program
- Foundations of Project Management
- Corporate Governance
- Business for Good
- Product Management First Steps

If asked about something not in this resume, politely state that you only have access to his professional background information provided here.
`;
