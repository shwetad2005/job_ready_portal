import { useNavigate, Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaChartLine,
  FaCode,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import aptitudeQuestions from "../data/aptitudeQuestions";
import "./Dashboard.css";

const preparationAreas = [
  {
    number: "01",
    label: "REASONING & NUMBERS",
    title: "Aptitude practice",
    description: "Build speed and accuracy with quantitative, logical, and verbal questions.",
    to: "/quantitative",
    action: "Start a quiz",
    icon: FaBrain,
    tone: "dashboard-area-green",
  },
  {
    number: "02",
    label: "PROBLEM SOLVING",
    title: "Coding practice",
    description: "Strengthen your programming fundamentals with focused coding problems.",
    to: "/coding",
    action: "Explore coding",
    icon: FaCode,
    tone: "dashboard-area-orange",
  },
  {
    number: "03",
    label: "COMMUNICATION",
    title: "Interview preparation",
    description: "Prepare for technical and HR conversations with thoughtful practice.",
    to: "/interview",
    action: "Prepare answers",
    icon: FaComments,
    tone: "dashboard-area-blue",
  },
];

function getRegisteredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const registeredUser = getRegisteredUser();
  const firstName = registeredUser?.fullName?.trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">JOBREADY / YOUR WORKSPACE</span>
            <h1>{greeting}, {firstName}.</h1>
            <p>Make your next preparation session count.</p>
          </div>
          <div className="dashboard-header-actions">
            <Link className="dashboard-progress-link" to="/progress">
              <FaChartLine aria-hidden="true" /> Progress
            </Link>
            <button className="dashboard-logout" type="button" onClick={handleLogout}>
              <FaSignOutAlt aria-hidden="true" /> Log out
            </button>
          </div>
        </header>

        <section className="dashboard-focus" aria-labelledby="focus-title">
          <div className="focus-copy">
            <span className="focus-kicker"><FaBolt aria-hidden="true" /> QUICK START</span>
            <h2 id="focus-title">A few focused questions<br />can move you forward.</h2>
            <p>Start with a short aptitude set, then choose what to work on next.</p>
            <Link className="focus-button" to="/quantitative">
              Start aptitude practice <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="focus-count" aria-label={`${aptitudeQuestions.length} aptitude questions available`}>
            <span className="count-number">{String(aptitudeQuestions.length).padStart(2, "0")}</span>
            <span className="count-label">questions<br />ready to try</span>
            <span className="count-rule" />
            <span className="count-caption">QUANTITATIVE APTITUDE</span>
          </div>
        </section>

        <section className="dashboard-areas" aria-labelledby="areas-title">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">PICK UP A SKILL</span>
              <h2 id="areas-title">Your preparation areas</h2>
            </div>
            <Link to="/progress" className="dashboard-all-progress">
              View progress <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="dashboard-area-grid">
            {preparationAreas.map(({ number, label, title, description, to, action, icon: Icon, tone }) => (
              <Link className={`dashboard-area ${tone}`} to={to} key={number}>
                <div className="area-topline">
                  <span className="area-number">{number}</span>
                  <span className="area-icon"><Icon aria-hidden="true" /></span>
                </div>
                <span className="area-label">{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="area-action">{action} <FaArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-next-step" aria-label="Preparation reminder">
          <span className="next-step-mark"><FaBolt aria-hidden="true" /></span>
          <div>
            <h2>Consistency beats cramming.</h2>
            <p>Choose one area, finish a session, and come back for the next one.</p>
          </div>
          <Link to="/aptitude" aria-label="See aptitude preparation details">
            <FaArrowRight aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;