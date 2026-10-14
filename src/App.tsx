import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import AICore from "./components/AICore";
import BrandEmblem from "./components/BrandEmblem";
import Header from "./components/Header";
import SectionTitle from "./components/SectionTitle";
import ProjectCard from "./components/ProjectCard";
import ProjectPage from "./components/ProjectPage";
import ContactForm from "./components/ContactForm";
import projects from "./data/projects.json";
const research = [
  "AI Research and Development",
  "Intelligent Automation",
  "Conversational AI",
  "Voice Technology",
  "Mobile AI Applications",
  "Human-AI Interaction",
  "Experimental Robotics",
];
const departments = [
  "Mission Control",
  "AI Development Workspace",
  "Project Laboratory",
  "Engineering Operations",
  "Founder Dashboard",
];
export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const slug = window.location.pathname.match(/\/projects\/([^/]+)\/?$/)?.[1];
  const project = projects.find((p) => p.slug === slug);
  useEffect(() => {
    if (
      !root.current ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.05 },
    );
    root.current.querySelectorAll(".section").forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  if (project) return <ProjectPage project={project} />;
  if (slug)
    return (
      <main className="container project-page">
        <h1>Project not found</h1>
        <p>This project isn’t in the laboratory portfolio.</p>
        <a className="button primary" href="../../#projects">
          Back to projects
        </a>
      </main>
    );
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> eXperimental Autonomous Virtual
              Intelligence Core
            </div>
            <h1>
              One Vision.
              <br />
              <span>Intelligent Systems.</span>
              <br />
              Endless Possibilities.
            </h1>
            <p>
              An independent AI development laboratory researching intelligent,
              adaptive, and practical systems that improve productivity,
              creativity, and everyday life.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                Explore Projects <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#about">
                About the lab <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-foot">
              <span className="status-dot" /> ALWAYS BUILDING{" "}
              <span className="divider">/</span> ONE IDEA AT A TIME
            </div>
          </div>
          <AICore />
        </section>
        <div className="ticker">
          <div className="container">
            IDEAS INTO REALITY <span>✦</span> CODE WITH PURPOSE <span>✦</span>{" "}
            EXPLORE THE UNKNOWN <span>✦</span> BUILT TO EVOLVE <span>✦</span>
          </div>
        </div>
        <section className="container section about" id="about">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE LAB / OUR PURPOSE</div>
              <h2>
                Intelligence with purpose<span>.</span>
              </h2>
            </div>
            <p>
              Founded and led by
              <br />
              <strong>Jae Picardo</strong>
            </p>
          </div>
          <p className="about-intro">
            XAVIC-Labs — eXperimental Autonomous Virtual Intelligence Core — is
            an AI development laboratory exploring intelligent digital
            assistants, automation, and human-AI collaboration.
          </p>
          <div className="about-grid">
            <article>
              <h3>Our mission</h3>
              <p>
                To research, design, and develop intelligent, adaptive, and
                practical AI systems that improve human productivity,
                creativity, and everyday life.
              </p>
            </article>
            <article>
              <h3>Our vision</h3>
              <p>
                To establish XAVIC-Labs as an innovative AI development
                laboratory focused on intelligent digital assistants,
                automation, and human-AI collaboration.
              </p>
            </article>
            <article>
              <h3>Our philosophy</h3>
              <p>
                Adaptability. Practical functionality. User control. Responsible
                automation. We build with the people using our systems at the
                center.
              </p>
            </article>
          </div>
        </section>

        <section className="container section" id="projects">
          <SectionTitle label="01 / THE PORTFOLIO" title="Ideas taking shape">
            One laboratory. Five initiatives.
            <br />A shared vision for what comes next.
          </SectionTitle>
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
          <p className="portfolio-note">
            Development and research initiatives. No completed products or
            public releases are claimed.
          </p>
        </section>
        <section className="timeline-section" id="laboratory">
          <div className="container section">
            <SectionTitle
              label="02 / DEVELOPMENT LABORATORY"
              title="Curiosity is our starting point"
            >
              Advanced Technology. Intelligent Design.
              <br />
              Human-Centered Innovation.
            </SectionTitle>
            <div className="research-grid">
              {research.map((name, index) => (
                <article key={name}>
                  <span className="eyebrow">
                    DIRECTION / {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{name}</h3>
                </article>
              ))}
            </div>
            <p className="portfolio-note">
              Current interests and development directions, not claims of
              completed products.
            </p>
          </div>
        </section>
        <section className="container section" id="command-center">
          <SectionTitle
            label="03 / COMMAND CENTER"
            title="A place for every part of the mission"
          >
            The operational headquarters
            <br />
            of XAVIC-Labs.
          </SectionTitle>
          <div className="department-grid">
            {departments.map((name, index) => (
              <article key={name}>
                <span className="department-number">0{index + 1}</span>
                <h3>{name}</h3>
              </article>
            ))}
          </div>
          <p className="portfolio-note">
            Public organizational overview only. Internal dashboards,
            development records, and private workspaces are not connected to
            this website.
          </p>
        </section>
        <section className="timeline-section" id="timeline">
          <div className="container section">
            <SectionTitle
              label="04 / DEVELOPMENT TIMELINE"
              title="Built one step at a time"
            >
              Current focus and future direction.
              <br />
              No invented launch dates.
            </SectionTitle>
            <div className="timeline">
              {[
                [
                  "01",
                  "The laboratory vision",
                  "Foundation",
                  "Define an AI laboratory centered on practical functionality, adaptability, user control, and responsible automation.",
                ],
                [
                  "02",
                  "Intelligence in development",
                  "Current focus",
                  "K.A.T.H. and A.R.I.A. are in active development. The website connects the lab’s projects and initiatives.",
                ],
                [
                  "03",
                  "Future possibilities",
                  "Research & concepts",
                  "Explore XAVIC for business automation and Zyro as an interactive companion. Continue learning through experimentation.",
                ],
              ].map(([n, title, status, text]) => (
                <article key={n}>
                  <span className="milestone">{n}</span>
                  <div className="eyebrow">{status}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="container section" id="technology">
          <SectionTitle
            label="05 / THE TOOLKIT"
            title="Good ideas. Powerful tools"
          >
            A modern web foundation.
            <br />
            Room to keep evolving.
          </SectionTitle>
          <div className="tech-grid">
            {[
              ["React", "Component-driven interfaces", "⚛"],
              ["TypeScript", "Clarity at every layer", "TS"],
              ["Vite", "A faster development loop", "ϟ"],
              ["Tailwind CSS", "Design without boundaries", "≈"],
            ].map(([name, desc, symbol]) => (
              <div className="tech-item" key={name}>
                <span className="tech-symbol" aria-hidden="true">
                  {symbol}
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="container section founder" id="founder">
          <div className="founder-monogram" aria-hidden="true">
            JP<span>FOUNDER / XAVIC-LABS</span>
          </div>
          <div>
            <div className="eyebrow">06 / BEHIND THE LAB</div>
            <h2>
              Jae Picardo<span>.</span>
            </h2>
            <p className="founder-role">
              Founder & Lead Developer · XAVIC-Labs
            </p>
            <p>
              An IT developer and independent technology enthusiast focused on
              AI development, software engineering, intelligent automation, and
              experimental technology.
            </p>
            <p>
              “Advanced Technology. Intelligent Design. Human-Centered
              Innovation.”
            </p>
          </div>
        </section>
        <section className="container contact" id="contact">
          <div className="eyebrow">07 / CONNECT WITH THE LAB</div>
          <h2>
            The next big idea
            <br />
            could start with <span>hello.</span>
          </h2>
          <p>
            Have an idea, a question, or a different way of seeing things?
            <br />
            Let’s open a conversation.
          </p>
          <div className="contact-layout">
            <ContactForm />
            <aside className="contact-channels">
              <h3>Find the lab</h3>
              {["Email", "GitHub", "Social media"].map((name) => (
                <div key={name}>
                  <span>{name}</span>
                  <p>To be announced</p>
                </div>
              ))}
              <p>Official contact details will appear here once confirmed.</p>
            </aside>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <a className="brand" href="#">
          <BrandEmblem />
          XAVIC
          <span className="muted">/ LABS</span>
        </a>
        <span>© {new Date().getFullYear()} XAVIC-Labs</span>
        <span className="footer-note">
          STAY CURIOUS. KEEP BUILDING. <span className="status-dot" />
        </span>
      </footer>
    </div>
  );
}
