import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Wrench,
  Lightbulb,
  Droplets,
  Armchair
} from "lucide-react";
import { Link } from "react-router-dom";

const issueTypes = [
  {
    name: "Electrical",
    description: "Lights, switches and wiring",
    icon: Lightbulb,
    color: "purple"
  },
  {
    name: "Plumbing",
    description: "Water leaks and taps",
    icon: Droplets,
    color: "blue"
  },
  {
    name: "Furniture",
    description: "Desks, chairs and fixtures",
    icon: Armchair,
    color: "orange"
  },
  {
    name: "Maintenance",
    description: "Other campus issues",
    icon: Wrench,
    color: "green"
  }
];

const stats = [
  {
    label: "Total complaints",
    value: "—",
    note: "Awaiting live data",
    icon: ClipboardList
  },
  {
    label: "Pending",
    value: "—",
    note: "Awaiting live data",
    icon: Clock3
  },
  {
    label: "Resolved",
    value: "—",
    note: "Awaiting live data",
    icon: CheckCircle2
  }
];

export default function Home() {
  return (
    <div className="dashboard">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">CAMPUS OPERATIONS</p>
          <h1>Campus care starts here.</h1>
          <p className="page-description">
            Report a problem, follow its progress, and help
            make your campus a better place.
          </p>
        </div>

        <Link className="primary-button" to="/complaints/new">
          <Plus size={18} />
          Report an issue
        </Link>
      </section>

      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-tag">YOUR CAMPUS, YOUR VOICE</span>
          <h2>Small fixes make a big difference.</h2>
          <p>
            From broken lights to leaking taps, report issues
            in one place and keep track of what happens next.
          </p>
          <Link className="hero-link" to="/complaints">
            Track your complaints
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-circle circle-one" />
          <div className="art-circle circle-two" />
          <div className="art-document">
            <CheckCircle2 size={35} />
            <span className="art-line line-long" />
            <span className="art-line" />
            <span className="art-line line-short" />
            <div className="art-status">Issue reported</div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Campus overview</h2>
            <p>Complaint statistics will appear here.</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <article className="stat-card" key={label}>
              <div className="stat-top">
                <span>{label}</span>
                <span className="stat-icon">
                  <Icon size={20} />
                </span>
              </div>
              <strong className="stat-number">{value}</strong>
              <span className="stat-note">{note}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>What needs fixing?</h2>
            <p>Choose a category when reporting an issue.</p>
          </div>
        </div>

        <div className="category-grid">
          {issueTypes.map(({ name, description, icon: Icon, color }) => (
            <Link
              to="/complaints/new"
              className="category-card"
              key={name}
            >
              <span className={`category-icon ${color}`}>
                <Icon size={22} />
              </span>
              <strong>{name}</strong>
              <span>{description}</span>
              <ArrowUpRight className="category-arrow" size={17} />
            </Link>
          ))}
        </div>
      </section>

      <section className="notice-card">
        <span className="notice-icon">
          <ClipboardList size={21} />
        </span>
        <div>
          <strong>One place for every campus issue</strong>
          <p>
            Submit clear details and a photo when possible.
            Your complaint tracking will be available after
            authentication and database integration.
          </p>
        </div>
      </section>
    </div>
  );
}