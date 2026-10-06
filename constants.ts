import {
  ExperienceItem,
  ProjectItem,
  SkillCategory,
  LinkedInPost,
  BTSImage,
  ProofStat,
  WorkCard,
  AlsoBuiltItem,
  CaseStudyPage,
  CertificationItem,
  FunnelStage,
  TrayaInsight,
  RoadmapMonth,
} from './types';

export const RESUME_DATA = {
  name: "Akshat Saxena",
  title: "Associate Product Manager",
  tagline: "B2B internal tools, logistics & commerce | PRD to post-launch measurement",
  email: "akshatsaxena7974@gmail.com",
  phone: "+91 7974920243",
  location: "Pune, Maharashtra, India",
  linkedin: "https://www.linkedin.com/in/akshat-saxena-5513a8258",
  github: "https://github.com/axstorch",
  resume: "https://drive.google.com/file/d/1Ye-W37kHNLRmzGtryg6cORLl_PxkkdRH/view?usp=drive_link",
  summary:
    "Computer Science graduate with 2 product internships across B2B internal tools and logistics. Shipped CRM automations, a CMS revamp, and data-driven root-cause analyses that changed team decisions. Comfortable going from SQL and data insights to requirements and engineering tickets.",
};

/** Abbreviates month names to their standard 3-letter form. */
export const shortMonths = (value: string): string =>
  value.replace(
    /\b(January|February|March|April|June|July|August|September|October|November|December|May)\b/g,
    (m) => m.slice(0, 3)
  );

export const EDUCATION_DATA = {
  school: "Kalinga Institute of Industrial Technology",
  degree: "B.Tech, Computer Science & Engineering",
  period: "2022 - 2026",
  cgpa: "8.57",
  location: "Bhubaneswar, Odisha, India",
};

export const PROOF_STATS: ProofStat[] = [
  {
    id: "p1",
    value: "23%",
    context:
      "YoY drop in US call pickup rates traced to voicemails being counted as pickups; sales resumed voicemail outreach.",
    label: "AmberStudent",
  },
  {
    id: "p2",
    value: "40+ \u2192 3",
    context: "CRM/CMS escalations resolved and converted into 3 shipped automations.",
    label: "AmberStudent",
  },
  {
    id: "p3",
    value: "18.7K",
    context:
      "students affected by duplicate email sequences; shipped consolidation to one combined email per student.",
    label: "AmberStudent",
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "amber",
    role: "Product Management Intern, CRM & CMS",
    company: "AmberStudent",
    period: "May 2026 - Present",
    location: "Pune, India",
    logo: "/assets/logos/amberstudent.jpg",
    /* Bullet text below is verbatim from Akshat_saxena_resume_APM.pdf, in
       resume order. The resume has no bolded bullet prefixes, so `label` is
       omitted and the bullets render as plain text. */
    description: [
      "Led RCA on a 23% YoY drop in US call pickup rates; when Metabase segmentation by time, agent, and region showed no clear driver, reviewed 20+ Plivo call recordings and traced the drop to agents no longer leaving voicemails, which the 15-second threshold had been counting as pickups. Findings, presented at the bi-weekly product review, led the sales team to resume voicemail outreach.",
      "Owned requirements, prioritisation, and QA for a CMS revamp used by supply, content, and SEO teams to manage property and region listings; scoped P0s around the supply team's new-hire onboarding deadline and caught 12+ pre-launch issues, including data loss on saves and room-level currency overrides that risked pricing errors.",
      "Resolved 40+ CRM/CMS escalations and converted the top recurring types into 3 shipped automations: auto-resetting call mappings for repeat leads with non-Indian numbers (4-5 manual resets/day), locking lead-state changes after agent log-off to stop false call-duration flags, and auto-closing internal test leads.",
      "Traced a student blocking Amber's emails to duplicate email sequences triggered by multi-property booking forms, an issue affecting 18.7K students over 12 months; proposed and shipped consolidation logic that sends one combined email per student.",
    ],
  },
  {
    id: "swift",
    role: "Product Intern",
    company: "Swift Logistics",
    period: "January 2026 - March 2026",
    location: "Bengaluru, India",
    logo: "/assets/logos/swift.jpg",
    /* Verbatim from the resume, in resume order. See the AmberStudent note. */
    description: [
      "Caught a vendor billing bug in Exotel's call API: ~23K calls over 6 months were returned as \"successful\" with no duration or recording URL, meaning unconnected calls were being billed. Ruled out API changes on both sides and escalated; Exotel confirmed the bug and waived charges for all flagged call IDs.",
      "Traced a prime seller's drop in daily shipments to a Shopify pickup-address change that was never synced to our system, causing every shipment request to be silently rejected; by then, 271 shipments had gone to competitors. Escalated to the account manager, walked the seller through the fix directly, and monitored volumes back to normal.",
      "Owned first-line tech escalations from 35-40 account managers across 300+ cases, then automated the top recurring types (pincode serviceability failures at 10-12/day and courier-allocation queries) with an AI-assisted Slack bot that had read-only MongoDB and BigQuery access. This cut average resolution time for low-to-medium escalations by 32%.",
      "Diagnosed a shipment-export bug where pagination without a fixed sort order, under a 2,000-row limit, silently dropped or duplicated entries across exports; root cause verified and fixed by engineering.",
    ],
  },
  {
    id: "sor",
    role: "Strategy & Consulting Intern",
    company: "SOR Informatics",
    period: "June 2025 - September 2025",
    location: "Hyderabad, India",
    label: "Competitive analysis",
    logo: "/assets/logos/sor.jpg",
    description: [
      "Competitive analysis: Led structured competitor and feature-gap analyses for 4 client products, directly informing roadmap priorities and product positioning decisions.",
      "Cross-functional: Acted as a coordination bridge between field teams and leadership, synthesizing updates from 6 on-ground associates into clear, decision-ready insights.",
      "User research: Designed and executed targeted market and user research across 3 engagements, translating insights into actionable recommendations for product and growth strategy.",
    ],
  },
];

export const WORK_DATA: WorkCard[] = [
  {
    id: "newme",
    number: "01",
    title: "NEWME",
    subtitle: "Retention Analysis & Strategy",
    description:
      "Defined 60-day retention, measured a 10.55% baseline, and designed cohort-based journeys and A/B tests targeting 14-15%.",
    outcome: "Retention nearly doubles for users with 10+ wishlisted items.",
    tags: ["Retention", "Cohort analysis", "A/B testing", "Lifecycle journeys"],
    href: "/work/newme",
    image: "/assets/work/newme-retention.png",
    imageAlt: "Bar chart showing retention rate rising with wishlist count",
    imageSlotLabel: "NEWME_IMAGE",
  },
  {
    id: "traya",
    number: "02",
    title: "Traya",
    subtitle: "Checkout Conversion Case Study",
    description:
      "Interview case study using funnel data provided by Traya: 8 prioritised enhancements, a 3-month roadmap and a PRD for deep-linking recovery messages into in-app checkout.",
    outcome: "Roadmap targets +30% 24-hour conversion.",
    tags: ["Funnel analysis", "PRD", "Roadmapping", "Prioritisation"],
    href: "/work/traya",
    image: "/assets/work/traya-impact-effort.png",
    imageAlt: "Impact against effort matrix plotting eight prioritised enhancements",
    imageSlotLabel: "TRAYA_IMAGE",
    badge: "Interview case study",
  },
  {
    id: "chotu",
    number: "03",
    title: "Chotu",
    subtitle: "Hyperlocal Quick-Commerce PRD",
    description:
      "End-to-end PRD connecting tier-3/4 city buyers with nearby kirana stores across four personas, with MVP scoping and a payment-intent flow.",
    outcome: "Explicit trade-offs: what's in the MVP and what is deliberately out.",
    tags: ["PRD", "MVP scoping", "Marketplace", "Requirements"],
    href: "/work/chotu",
    image: "/assets/work/chotu-journey.png",
    imageAlt: "Buyer journey flow diagram from order to fulfilment",
    imageSlotLabel: "CHOTU_IMAGE",
  },
];

export const CASE_STUDY_PAGES: CaseStudyPage[] = [
  {
    slug: "newme",
    title: "NEWME",
    summary: "Defining and improving retention for a wishlist driven commerce product.",
    role: "Author",
    type: "Case study",
    date: "Jan 2026",
    sections: [
      {
        heading: "Context",
        body: "A commerce product with a large wishlist population and no agreed definition of retention. Without a shared metric, no improvement could be measured or argued for.",
      },
      {
        heading: "Problem",
        body: "Retention was undefined, so the team could not tell whether weak retention was a demand problem or a conversion problem, and could not prioritise work against it.",
      },
      {
        heading: "Approach",
        body: "I defined 60-day retention as a repeat order within 60 days of the last purchase and measured a 10.55% baseline. Segmenting by wishlist depth showed retention nearly doubles for users with 10+ wishlisted items, which points to purchase friction rather than a lack of interest. I split the base into 3 cohorts: first-time buyers at 30-60 days, high-wishlist single-order users, and lapsed repeat buyers.",
      },
      {
        heading: "Deliverables",
        body: "A retention definition and baseline, a cohort analysis, multi-channel lifecycle journeys for each cohort, and an A/B test plan.",
      },
      {
        heading: "Outcome / Decision",
        body: "The recommendation was to target 14-15% retention by removing purchase friction for high-wishlist users, rather than spending on broad acquisition. The wishlist finding is what redirected the strategy.",
      },
      {
        heading: "What I would do next",
        body: "I would size the friction directly. The wishlist correlation identifies where to look, but the next step is instrumenting the checkout steps those users hit, so the test addresses a measured cause instead of a correlated one.",
      },
    ],
    deliverables: [
      { src: "/assets/work/newme-retention.png", alt: "Retention by wishlist count bar chart", caption: "Retention by wishlist count", slotLabel: "NEWME_IMAGE" },
      { src: "/assets/work/newme-journey.png", alt: "Lifecycle journey flow across the three retention cohorts", caption: "Lifecycle journey flow", slotLabel: "NEWME_IMAGE_2" },
    ],
    deckUrl: "https://drive.google.com/file/d/1-Pxwol1QG137sGJvZ1SNZaS1JnjIlhLz/view?usp=drive_link",
    deckLabel: "View full case study",
  },
  {
    slug: "traya",
    title: "Traya",
    summary: "Improving signup to purchase conversion, using funnel data shared by the company.",
    role: "Author",
    type: "Case study",
    date: "Jan 2026",
    sections: [
      {
        heading: "Context",
        body: "An interview case study, not employment or a client engagement. Traya shared funnel data for the exercise, and I ran the analysis and wrote the recommendations independently.",
      },
      {
        heading: "Problem",
        body: "The post-assessment funnel loses users before they convert inside the 24-hour window. 82% of assessment takers never reach Purchase. The two biggest leaks are Kit Preview to Checkout, down 25 points, and Checkout to Payment, down 17 points. For the exercise, acquisition is a first successful order, signup is OTP verified, and purchase is payment confirmed.",
      },
      {
        heading: "Approach",
        body: "I walked the funnel stage by stage to locate where intent is lost: Assessment 100%, Kit Preview 70%, Checkout Start 45%, Payment 28%, Purchase 18%. Each stage carries a distinct reason for the drop, so pricing anxiety, app and web friction and missing urgency are separate problems rather than one conversion problem. From that I wrote 8 enhancements across 4 levers, reduce friction, improve intent, personalise, and recover delayed users.",
      },
      {
        heading: "Deliverables",
        body: "8 prioritised enhancements, each with the problem, the proposed solution, and an effort and impact rating. An impact against effort matrix placing all 8 into quadrants: 5 quick wins, 2 major projects, 1 fill-in and none to reconsider. A 3-month roadmap sequencing them, and a full PRD for deep-linking WhatsApp and SMS recovery messages into a pre-filled in-app checkout, including analytics events, risks, a 6-week rollout and click-to-purchase as the primary metric.",
      },
      {
        heading: "Outcome / Decision",
        body: "The target is +30% signup to purchase conversion within 24 hours over 3 months. The first change recommended is the deep-link recovery checkout, the only item rated very high impact at low effort, because delayed high-intent users are the largest recoverable group and re-authentication is the single most avoidable step in the funnel.",
      },
      {
        heading: "What I would do next",
        body: "Ship the five quick wins together in month one and read the funnel again before starting the AI work. The AI journey and before/after previews are the only high-effort items, and the deck assumes they earn their cost. I would want the month one numbers before committing two months of build, and I would instrument the two drop-off stages first so the impact ratings rest on observed behaviour rather than inference.",
      },
    ],
    deliverables: [
      { alt: "Conversion funnel by stage", caption: "Funnel by stage", slotLabel: "traya:funnel" },
      { alt: "Impact against effort matrix", caption: "Impact against effort", slotLabel: "traya:matrix" },
      { src: "/assets/work/traya-prd.png", alt: "Deep-link checkout PRD page", caption: "Deep-link checkout PRD", slotLabel: "traya:prd", href: "https://drive.google.com/file/d/1r2W6zmFs-RhAYRgZZuclasMElO2KXolo/view?usp=drive_link" },
    ],
    deckUrl: "https://drive.google.com/file/d/19lH1FvUJnS90CiY9vrb_BTWvCCcRMEEm/view?usp=drive_link",
    deckLabel: "View full case study",
  },
  {
    slug: "chotu",
    title: "Chotu",
    summary: "An end-to-end PRD for a hyperlocal quick-commerce marketplace.",
    role: "Author",
    type: "PRD",
    date: "August 2025",
    sections: [
      {
        heading: "Context",
        body: "A tier-3 and tier-4 city market where organised delivery does not reach and kirana stores already hold the inventory and the customer relationships.",
      },
      {
        heading: "Problem",
        body: "Buyers in smaller cities lack reliable quick commerce, while kirana owners cannot serve demand beyond walk-in customers. A marketplace has to be viable for both sides, which is a different problem from building another delivery app.",
      },
      {
        heading: "Approach",
        body: "I wrote the PRD across 4 personas: buyer, kirana owner, delivery partner and support agent, with MVP tagged requirements, non-functional requirements and success metrics. Revenue comes from urgent delivery fees plus premium kirana subscriptions.",
      },
      {
        heading: "Deliverables",
        body: "An end-to-end PRD covering both sides of the marketplace, MVP and post-MVP requirements, success metrics, and a payment-intent flow that captures payment only after a kirana accepts an order.",
      },
      {
        heading: "Outcome / Decision",
        body: "In scope: an owned delivery fleet, single-store fulfilment, and manual inventory for low-tech users. Out of scope, deliberately: ratings, discounts and an AI bot. The payment-intent decision matters most, because charging before a store accepts would push the risk onto buyers and make stores cautious about accepting at all.",
      },
      {
        heading: "What I would do next",
        body: "I would validate the payment-intent flow with a small set of kirana owners first, and define the open issues on delivery reliability and inventory accuracy before writing the success metrics precisely enough to be accountable.",
      },
    ],
    deliverables: [
      { src: "/assets/work/chotu-journey.png", alt: "End-to-end buyer journey from order to delivery and refund", caption: "Buyer journey", slotLabel: "CHOTU_IMAGE" },
      { src: "/assets/work/chotu-personas.png", alt: "Persona definitions for the buyer, kirana owner and delivery partner", caption: "Personas", slotLabel: "CHOTU_IMAGE_2" },
    ],
    deckUrl: "https://drive.google.com/file/d/1xtN0crc_3Xr2lclhGWEbjlzhu8klH5zr/view?usp=drive_link",
    deckLabel: "View full PRD",
  },
];

export const ALSO_BUILT: AlsoBuiltItem[] = [
  {
    id: "ats",
    title: "AI Resume Screening Workflow",
    description:
      "n8n + LLM workflow that screens candidates against job requirements, with hash-based deduplication.",
    tags: ["n8n", "LLM", "Automation"],
  },
  {
    id: "bot",
    title: "Job-Alert Bot",
    description:
      "n8n workflow that searches for APM and product-intern roles and sends matching ones to Telegram.",
    tags: ["n8n", "Automation", "Telegram"],
  },
];

export const PROJECTS_DATA: ProjectItem[] = ALSO_BUILT.map((p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  technologies: p.tags,
  url: p.id === "ats"
    ? "https://github.com/axstorch/n8n-recruitment-automation"
    : "https://github.com/axstorch/LinkedIn-job-alert-automated",
  linkLabel: "View on GitHub",
}));

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Product",
    skills: [
      "PRD writing",
      "Requirements",
      "Prioritisation",
      "User research",
      "Roadmapping",
      "Root cause analysis",
      "Agile",
    ],
  },
  {
    category: "Data & Tools",
    skills: [
      "SQL",
      "BigQuery",
      "Metabase",
      "MongoDB",
      "Jira",
      "Figma/FigJam",
      "Excel",
      "n8n",
      "LLM workflows",
      "Funnel and cohort analysis",
      "A/B test design",
    ],
  },
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    title: "Project Management Foundations",
    issuer: "Google",
    url: "https://www.coursera.org/account/accomplishments/verify/VPIGGNTIVVFV",
  },
  {
    title: "Product Management First Steps",
    issuer: "LinkedIn Learning",
    url: "https://www.linkedin.com/learning/certificates/fa42c50c3180fa409d71ae6ca5015321e87876f0a7184de460af13bcfbc61e37",
  },
  {
    title: "Project Initiation",
    issuer: "Google",
    url: "https://www.coursera.org/account/accomplishments/verify/M4CYOA9VRSG1",
  },
  {
    title: "Project Planning",
    issuer: "Google",
    url: "https://www.coursera.org/account/accomplishments/verify/M4CYOA9VRSG1",
  },
  {
    title: "On-Premise Data Visualization",
    issuer: "Coursera",
    url: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Tata/MyXvBcppsW2FkNYCX_Tata_bm7RavEb24C2zq9as_1691496892553_completion_certificate.pdf",
  },
  {
    title: "Corporate Governance",
    issuer: "Coursera",
    url: "https://drive.google.com/file/u/2/d/1fgvRLcJKV1NhCTDXjX8DpDQ8AzAgHAzS/view?usp=drive_link",
  },
];

export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: "7402742225333338112",
    title: "Driving adoption with the help of cute balloons and bracelets",
    excerpt: "Noticed a marketing strategy in my campus that worked... too well!",
    date: "Dec 2024",
    likes: 80,
    comments: 12,
    url: "https://www.linkedin.com/feed/update/urn:li:share:7402742225333338112",
    image: "/assets/linkedin/Post1.webp",
  },
  {
    id: "7414255276062740481",
    title: "An AI-powered resume screening workflow that streamlines recruitment",
    excerpt:
      "Built an AI-powered resume screening workflow using n8n that automatically screens incoming resumes based on job descriptions, deduplicate candidates, and rank applicants based on relevance and qualifications.",
    date: "Jan 2026",
    likes: 30,
    comments: 9,
    url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7414255276062740481",
    image: "/assets/linkedin/Project3.webp",
  },
  {
    id: "7409573688792014851",
    title: "A simple UI change that can ease the lives of millions!",
    excerpt:
      "When you go through your payment history, all you see are random names. You scratch your head, wondering why you paid Kirana Labs Rs 245?",
    date: "Dec 2024",
    likes: 28,
    comments: 12,
    url: "https://www.linkedin.com/embed/feed/update/urn:li:share:7409573688792014851",
    image: "/assets/linkedin/UPI.webp",
  },
  {
    id: "7408625085772668928",
    title: "Why scroll through a list of job postings when you can have them come to you?",
    excerpt:
      "Built an automation using n8n that connects with telegram to share latest job postings directly to me.",
    date: "Dec 2024",
    likes: 19,
    comments: 4,
    url: "https://www.linkedin.com/embed/feed/update/urn:li:share:7408625085772668928",
    image: "/assets/linkedin/automation.webp",
  },
  {
    id: "7407295316380737536",
    title: "How our product can save time, boost revenue and save you from hunger?",
    excerpt:
      "Ever stood in a long queue at a food court, hungry and frustrated? Our app Crave is here to change that!",
    date: "Dec 2024",
    likes: 31,
    comments: 3,
    url: "https://www.linkedin.com/embed/feed/update/urn:li:share:7407295316380737536",
    image: "/assets/linkedin/crave2.webp",
  },
  {
    id: "7390306392219291648",
    title: "Explaining the 4 pillars of OOPS using water bottle?",
    excerpt:
      "How a simple water bottle can help you understand the 4 pillars of OOPS in programming!",
    date: "Nov 2024",
    likes: 43,
    comments: 9,
    url: "https://www.linkedin.com/feed/update/urn:li:share:7390306392219291648",
    image: "/assets/linkedin/Post2.webp",
  },
  {
    id: "7331336647088713730",
    title: "A simple weather app using React and OpenWeather API",
    excerpt: "It was a project and had to be submitted under 4 hours. It does work!",
    date: "June 2025",
    likes: 57,
    comments: 4,
    url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7331336647088713730",
    image: "/assets/linkedin/Post4.webp",
  },
  {
    id: "7330974262901596163",
    title: "A brief introduction to CRM systems",
    excerpt: "Same as title, A brief introduction to CRM systems.",
    date: "June 2025",
    likes: 26,
    comments: 1,
    url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7330974262901596163",
    image: "/assets/linkedin/Post3.webp",
  },
];

export const BTS_IMAGES: BTSImage[] = [
  {
    id: "b1",
    caption: "Team at SOR",
    alt: "The SOR Informatics team standing together outdoors",
    aspectRatio: "landscape",
    image: "/assets/bts/bts1.jpg",
  },
  {
    id: "b3",
    caption: "With the Head of Hospitality",
    alt: "Talking with the Head of Hospitality about launching the Crave app",
    aspectRatio: "square",
    image: "/assets/bts/bts3.jpg",
  },
  {
    id: "b2",
    caption: "Writing something important",
    alt: "Writing at a desk during a work session",
    aspectRatio: "square",
    image: "/assets/bts/bts2.jpg",
  },
  {
    id: "b4",
    caption: "Appreciation from the team",
    alt: "A certificate or note of appreciation received from the team",
    aspectRatio: "square",
    image: "/assets/bts/bts4.jpg",
  },
];

/** Kept for the chatbot prompt, which reads from the same source of truth. */
/* ------------------------------------------------------------------ *
 * Traya teardown. Transcribed from Traya_Product_Teardown2.pptx (16 slides).
 * The deck contains no embedded images and no personal data, so the
 * funnel and the impact/effort matrix are rebuilt as real components
 * rather than screenshots.
 * ------------------------------------------------------------------ */

export const TRAYA_FUNNEL: FunnelStage[] = [
  { label: "Assessment", percent: 100, note: "Starting point" },
  { label: "Kit Preview", percent: 70, note: "Pricing anxiety" },
  { label: "Checkout Start", percent: 45, note: "App and web friction" },
  { label: "Payment", percent: 28, note: "Urgency missing" },
  { label: "Purchase", percent: 18, note: "Final conversion" },
];

export const TRAYA_INSIGHTS: TrayaInsight[] = [
  {
    n: 1,
    theme: "Assessment",
    title: "Assessment Progress Indicator",
    problem:
      "Users quit the assessment mid-way because they have no sense of how many questions remain or how long it will take.",
    solution: [
      "Show \"Question 12 of 15\"",
      "Add micro-copy: \"3 more to go\"",
      "Estimated time: \"~1 min left\"",
      "Animated progress bar at top",
    ],
    effort: "Low",
    impact: "High",
    priority: "P1",
  },
  {
    n: 2,
    theme: "Recovery",
    title: "Deep-link Recovery Checkout",
    problem:
      "WhatsApp recovery links open the web checkout, forcing users to re-authenticate. Most drop off before they get back to where they were.",
    solution: [
      "Deep-link straight into the app",
      "Pre-filled cart on landing",
      "One-tap checkout flow",
      "Fallback to web only if app missing",
    ],
    effort: "Low",
    impact: "Very High",
    priority: "P1",
  },
  {
    n: 3,
    theme: "Pricing",
    title: "Pricing Psychology at Checkout",
    problem:
      "A large lump-sum price triggers sticker shock and hesitation right at the moment of payment.",
    solution: [
      "Frame the saving rather than the total",
      "\"Offer valid for next 24 hours\"",
      "Visual strike-through on MRP",
    ],
    effort: "Low",
    impact: "High",
    priority: "P1",
  },
  {
    n: 4,
    theme: "Urgency",
    title: "Personalised 24-Hour Offer Unlock",
    problem:
      "A static discount feels permanent, so there is no reason to act now. Users postpone and never return.",
    solution: [
      "Interactive \"Unlock Offer\" button",
      "Live 24-hour countdown timer",
      "Personalised to the user's plan",
      "Push and WhatsApp nudge at T-2h",
    ],
    effort: "Low",
    impact: "High",
    priority: "P1",
  },
  {
    n: 5,
    theme: "CTA Copy",
    title: "CTA Copy Optimization",
    problem:
      "Generic \"Buy Now\" copy does not connect with the emotional reason users came to Traya in the first place.",
    solution: [
      "\"Claim Your Routine ->\"",
      "\"Save My Hair ->\"",
      "\"Start Recovery Today\"",
      "A/B test against control",
    ],
    effort: "Low",
    impact: "High",
    priority: "P1",
  },
  {
    n: 6,
    theme: "AI Journey",
    title: "AI Hair Transformation Journey",
    problem:
      "Users cannot visualise long-term results, so the perceived return of a 5-month plan feels abstract and unjustified.",
    solution: [
      "Personalised monthly progress preview",
      "Month 1, Month 3 and Month 5 visuals",
      "AI-generated from the user's scalp photo",
      "Shown inline at checkout",
    ],
    effort: "Medium",
    impact: "High",
    priority: "P1",
  },
  {
    n: 7,
    theme: "AI Reminders",
    title: "Personalised AI Before/After Previews",
    problem:
      "WhatsApp recovery reminders feel generic and easy to ignore, even for users who almost converted.",
    solution: [
      "Use the user's scalp photo as input",
      "Generate a realistic 5-month AI preview",
      "Embed the image in the WhatsApp reminder",
      "CTA back to one-tap checkout",
    ],
    effort: "Medium",
    impact: "Medium",
    priority: "P2",
  },
  {
    n: 8,
    theme: "UX Polish",
    title: "Polishing the User Experience",
    problem:
      "The flow works, but it does not feel premium. Small UX rough edges undermine trust in a healthcare-adjacent product.",
    solution: [
      "Smooth screen transitions",
      "Subtle motion and animations",
      "Haptic feedback on key actions",
      "Consistent loading states",
    ],
    effort: "High",
    impact: "High",
    priority: "P2",
  },
];

/** Quadrant placement, as drawn on slide 12 of the deck. */
export const TRAYA_QUADRANTS = [
  {
    key: "quick",
    name: "Quick wins",
    rule: "High impact, low effort",
    items: ["Recovery Deep-link", "Pricing Copy", "Assessment Progress", "24h Offer", "CTA Copy"],
  },
  {
    key: "major",
    name: "Major projects",
    rule: "High impact, high effort",
    items: ["AI Journey", "AI Previews"],
  },
  {
    key: "fill",
    name: "Fill-ins",
    rule: "Low impact, low effort",
    items: ["UX Polish"],
  },
  {
    key: "reconsider",
    name: "Reconsider",
    rule: "Low impact, high effort",
    items: [],
  },
];

export const TRAYA_ROADMAP: RoadmapMonth[] = [
  {
    month: "Month 1",
    title: "P1 Quick Wins",
    items: ["Assessment Progress", "Recovery Deep-link", "Pricing Copy", "24h Offer Unlock", "CTA Copy A/B"],
  },
  {
    month: "Month 2",
    title: "AI and Checkout",
    items: [
      "AI Transformation Journey",
      "AI Before/After previews",
      "Checkout enhancements",
      "WhatsApp reminder rev",
    ],
  },
  {
    month: "Month 3",
    title: "Test and Iterate",
    items: ["A/B test winners", "UX polish and haptics", "Funnel deep-dive"],
  },
];

export const TRAYA_EXPECTED_IMPACT = [
  { area: "Assessment", change: "Higher completion rate" },
  { area: "Purchase intent", change: "Stronger and clearer urgency" },
  { area: "Recovery", change: "Less friction in the funnel" },
  { area: "Trust", change: "Improved perceived value" },
];

export const TRAYA_LEARNINGS = [
  {
    n: "01",
    title: "Small UX changes compound",
    body: "Tiny improvements in copy, progress indicators and CTAs move conversion meaningfully when they ship together.",
  },
  {
    n: "02",
    title: "Behavioural psychology drives checkout",
    body: "Framing, urgency and personalisation shape decisions far more than discount size alone.",
  },
  {
    n: "03",
    title: "Reducing friction builds trust",
    body: "Every removed tap, re-auth or moment of doubt is a vote of confidence the user gives back to the brand.",
  },
];

export const SYSTEM_INSTRUCTION = `
You are an AI assistant for Akshat Saxena's portfolio website. You are speaking to a potential recruiter or hiring manager.
Answer only from the resume context below. Be concise and lead with the specific outcome or number.
If the information is not present here, say you do not have it.

Name: ${RESUME_DATA.name}
Title: ${RESUME_DATA.title}
Focus: ${RESUME_DATA.tagline}
Contact: ${RESUME_DATA.email}, ${RESUME_DATA.phone}
Location: ${RESUME_DATA.location}

Summary: ${RESUME_DATA.summary}

Experience:
${EXPERIENCE_DATA.map(
  (e) =>
    `- ${e.role} at ${e.company} (${e.period}, ${e.location}):\n` +
    e.description.map((d) => '  * ' + d).join('\n')
).join('\n\n')}

Case studies:
${CASE_STUDY_PAGES.map(
  (c) => `- ${c.title} (${c.type}): ${c.summary}\n  Outcome: ${c.sections.find((s) => s.heading.startsWith('Outcome'))?.body ?? ''}`
).join('\n\n')}

Also built:
${ALSO_BUILT.map((p) => `- ${p.title}: ${p.description}`).join('\n')}

Skills:
${SKILLS_DATA.map((s) => `- ${s.category}: ${s.skills.join(', ')}`).join('\n')}

Education: ${EDUCATION_DATA.school}, ${EDUCATION_DATA.degree} (${EDUCATION_DATA.period}), CGPA ${EDUCATION_DATA.cgpa}

Certifications: ${CERTIFICATIONS_DATA.map((c) => c.title).join('; ')}
`;
