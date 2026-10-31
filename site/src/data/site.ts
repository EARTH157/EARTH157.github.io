import whitepostHero from '../assets/robots/whitepost-hero.webp';
import amr300Hero from '../assets/robots/amr300-hero.webp';
import entechPim from '../assets/events/entech-pim.webp';
import entechRmutr from '../assets/events/entech-rmutr.webp';
import entechCobot from '../assets/events/entech-cobot.webp';
import mahout2026 from '../assets/events/mahout-2026.webp';
import peerHelpingPeer from '../assets/events/peer-helping-peer.webp';
import mahout2025 from '../assets/events/mahout-2025.webp';
import buildsHackathon from '../assets/events/builds-hackathon.webp';

export const profile = {
  name: 'Jirapat Chaumaungphan',
  role: 'Robotics & AI Engineer',
  current: 'Technical Engineer @ Entech',
  headline: 'Robots that see, decide, and deliver.',
  intro:
    'I build computer-vision robots, LLM/RAG tools, and the software that ties them together, on a Python, C++ and ROS2 foundation.',
  about: [
    "I work on both sides of a robot. In software, I design how a system should behave and plan its architecture before writing the code. In hardware, I design mechanical parts and lay out basic electrical systems, so the software has something real to run on.",
    "I'm now growing into AI engineering: designing AI harnesses that let a model use tools and run reliably, and building RAG applications that answer from real documents. I'm looking for AI engineering and robotics roles where models have to work outside the notebook.",
  ],
  email: 'earthzz.jirapat@outlook.com',
  github: 'https://github.com/EARTH157',
  linkedin: 'https://www.linkedin.com/in/jirapat-chaumaungphan-9a0a66326/',
  youtube: 'https://www.youtube.com/@jirapatchaumaungphan6870',
  cv: '/docs/Jirapat_Chaumaungphan_Resume.pdf',
};

export const stats = [
  { value: '300 kg', label: 'AMR payload, tested · TESR internship' },
  { value: '0.67 → 1.00', label: 'hit@1 with hybrid search + reranker · Tamra' },
  { value: '5-DOF', label: 'arm with full IK/FK control · White Post' },
  { value: '1st place', label: 'Physical AI Hackathon 2026 (Open)' },
];

// Robots shown in the hero. Only robots with a real 3D model belong here.
// anchor: the point a callout's leader line follows, as fractions (x, y, z) of the model's
// bounding box in its own Y-up coordinates (0 = min side, 1 = max side), snapped to real
// surface points of the original STL. posterAnchor / posterCentre: where those points land on
// the poster image (fractions of the square stage); the posters are the 3D view's first frame
// (no sway), so labels sit in the same place before and after the 3D scene loads.
export const robots = [
  {
    id: 'whitepost',
    label: 'White Post',
    name: 'WHITE POST',
    meta: 'Senior project · 2025–26',
    model: '/models/WhitePost.glb',
    poster: whitepostHero,
    posterCentre: [0.5, 0.4744],
    alt: '3D model of the White Post delivery robot: tracked base, electronics box and 5-DOF arm',
    callouts: [
      { title: '01 · 5-DOF ARM', lines: ['full IK / FK control', 'presses elevator buttons'], anchor: [0.664, 1.0, 0.05], posterAnchor: [0.66, 0.1456] },
      { title: '02 · VISION', lines: ['YOLOv8 + OpenCV', 'buttons + door state'], anchor: [0.567, 0.791, 0.779], posterAnchor: [0.4217, 0.3383] },
      { title: '03 · DRIVE', lines: ['tracked + wheel', 'multi-terrain base'], anchor: [0.869, 0.101, 0.493], posterAnchor: [0.5681, 0.7106] },
    ],
  },
  {
    id: 'amr300',
    label: 'AMR300',
    name: 'AMR300',
    meta: 'TESR internship · 2025',
    model: '/models/AMR300.glb',
    poster: amr300Hero,
    posterCentre: [0.5, 0.4744],
    alt: '3D model of the AMR300 high-payload autonomous mobile robot',
    callouts: [
      { title: '01 · PAYLOAD', lines: ['up to 300 kg', 'tested in real conditions'], anchor: [0.5, 0.604, 0.5], posterAnchor: [0.5, 0.415] },
      { title: '02 · COMPUTE', lines: ['ROS2 Humble', 'on an Intel NUC'], anchor: [0.5, 0.482, 0.925], posterAnchor: [0.3452, 0.5569] },
      { title: '03 · DRIVE', lines: ['hub servo motors', 'ESP32 over serial'], anchor: [0.891, 0.05, 0.872], posterAnchor: [0.5717, 0.8721] },
    ],
  },
];

export const moreProjects = [
  { year: '2025', title: 'RRT* path-planning navigation', note: 'Optimal, collision-free planning to a target', href: 'https://github.com/EARTH157/autonomous-robot-rrt-star' },
  { year: '2024', title: 'Service robot for a dental clinic', note: '5-DOF arm carries trays from sterilization to treatment rooms', href: 'https://github.com/EARTH157/Robot_Project1' },
  { year: '2024', title: 'Orange robot platform', note: 'Teleoperated mobile base + 5-DOF arm, simulated in Gazebo', href: 'https://github.com/EARTH157/Robot_ws' },
  { year: '2024', title: 'TurtleBot3 SLAM navigation', note: 'LiDAR SLAM + Nav2 mapping and path planning', href: 'https://www.youtube.com/watch?v=C79EKSHk_xU' },
];

export const work = [
  {
    period: 'Jul 2026 – Present',
    role: 'Technical Engineer (Robotics)',
    org: 'Entech Industrial Solution Co., Ltd.',
    orgUrl: 'https://www.entech.co.th',
    orgLinks: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/entechindustrialsolution/' },
      { label: 'Facebook', href: 'https://www.facebook.com/entechfanpage' },
    ],
    summary:
      'Python scripts and ROS2 packages for supplier robots, validated in NVIDIA Isaac Sim. Internal task tracker on Next.js + Supabase, deployed on Vercel.',
    highlights: [
      { date: 'Oct 2026', text: 'Led robot demos and a hands-on session for students at iCRAS, Panyapiwat Institute of Management (PIM)' },
      { date: 'Oct 2026', text: 'Hands-on AI & robotics session for engineering students, RMUTR Wang Klai Kangwon' },
      { date: 'Aug 2026', text: "Robot demos at Entech's booth, Cobot Contest Thailand 2026 (RMUTI Khon Kaen)" },
    ],
    links: [
      { label: 'Event post on LinkedIn', href: 'https://www.linkedin.com/posts/entechindustrialsolution_entechindustrialsolution-entech-eis-activity-7514153906193489920--wDK' },
      { label: 'Event post on Facebook', href: 'https://www.facebook.com/share/p/1C1M5g88rF/' },
    ],
  },
  {
    period: 'Apr – May 2025',
    role: 'Robotics Intern',
    org: 'TESR Co., Ltd.',
    orgUrl: 'https://www.facebook.com/ThaiEmbedded',
    orgLinks: [],
    summary: 'AMR300 high-payload mobile robot: drive system, ROS2 to ESP32 integration, 300 kg payload tests.',
    highlights: [],
    links: [],
  },
];

export const awards = [
  {
    badge: '1st place',
    tone: 'win',
    period: 'Jun 2026',
    title: 'Physical AI Hackathon 2026 (Open)',
    text: 'AI-powered CPR training kit that scores chest compressions with a pressure sensor and sends results to Telegram. Maker Faire Siam Square 2026.',
  },
  {
    badge: 'Stage 2 finalist',
    tone: 'finalist',
    period: 'Mar – May 2024',
    title: 'IEEE Region 10 Robotics Competition',
    text: 'Team Angkaew-one, one of two teams selected to represent Thailand. Built an autonomous surface vehicle for water-quality sampling.',
  },
  {
    badge: 'Competitor',
    tone: 'plain',
    period: 'Nov 2022 – Feb 2023',
    title: 'Jinpao Automation Contest 2023',
    text: "Designed the robot's mechanical chassis and structural components for stability.",
  },
];

export const education = {
  period: 'Jun 2022 – Mar 2026',
  degree: 'B.Eng. Robotics Engineering & Artificial Intelligence',
  school: 'Chiang Mai University',
  gpax: '3.06',
  coursework: ['Computer Vision', 'ROS2', 'AI for Robotics', 'Embedded Systems', 'System Analysis & Control', 'Robot Design Essential', 'Robotic Engineering'],
};

export const toolkit = [
  { title: 'Robotics', items: ['ROS2 (Foxy, Humble)', 'Nav2 · LiDAR SLAM', 'Gazebo · NVIDIA Isaac Sim', 'RViz2 · RRT* / A*'] },
  { title: 'Vision & AI', items: ['OpenCV · YOLOv8', 'Roboflow', 'LLM apps (RAG) · bge-m3', 'AI-assisted coding (Claude)'] },
  { title: 'Hardware', items: ['NVIDIA Jetson', 'Raspberry Pi 5 / Zero 2W', 'ESP32 · OpenCR · Arduino', '2D LiDAR · TurtleBot3'] },
  { title: 'Software', items: ['Python · C++ · C · Lua', 'Next.js · React · FastAPI', 'Supabase · Vercel', 'Git · Linux / Ubuntu'] },
];

export const languages = [
  { name: 'Thai', level: 'Native' },
  { name: 'English', level: 'Intermediate (CEFR B1)' },
];
export const languageCert = 'https://cert.efset.org/LLwup4';

export const events = [
  { image: entechPim, title: 'Robot demo for students', meta: 'Entech · iCRAS, PIM · Oct 2026', alt: 'Jirapat demonstrating a robot arm and a Quanser mobile robot from a laptop to a group of students', position: 'center 35%' },
  { image: entechRmutr, title: 'AI & robotics workshop', meta: 'Entech · RMUTR · Oct 2026', alt: 'Jirapat running a robot demo from a laptop, with Quanser and Hiwonder robots on the table' },
  { image: entechCobot, title: 'Robot demos, Entech booth', meta: 'Cobot Contest Thailand · Aug 2026', alt: 'Entech booth at Cobot Contest Thailand 2026 with a robot arm on a linear rail and a ROSPug quadruped', position: 'center 70%' },
  { image: mahout2026, title: 'Technical inspector', meta: 'Mahout Game · Feb 2026', alt: 'Participants and staff group photo at Mahout Game 2026' },
  { image: peerHelpingPeer, title: 'Volunteer', meta: 'Peer Helping Peer · Feb 2025', alt: 'Volunteers and the service robot during the dental checkup event' },
  { image: mahout2025, title: 'PR team, camera operator', meta: 'Mahout Game · Feb 2025', alt: 'Operating a video camera at Mahout Game 2025' },
  { image: buildsHackathon, title: '24 Hrs. builds Hackathon', meta: 'Smart University · Feb 2024', alt: 'Teams brainstorming Smart Campus ideas at the 24-hour builds hackathon' },
];
