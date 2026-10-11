// React Router import
import { Link } from "react-router-dom";

// React icon imports
import { MdQuiz } from "react-icons/md";
import {
  FaLaptopCode,
  FaUserTie,
  FaChartLine,
  FaArrowRight
} from "react-icons/fa";

import "./Features.css";

// Features section component
function Features() {
  return (
    <section className="practice-section" id="practice" aria-labelledby="practice-title">
      <div className="home-container">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Choose your next challenge</span>
            <h2 id="practice-title">The right practice<br className="mobile-break" /> for the next step.</h2>
          </div>
          <p>Build a well-rounded toolkit, one focused session at a time.</p>
        </div>
        <div className="practice-grid">
          <Link to="/aptitude" className="practice-tile tile-aptitude">
            <span className="tile-icon"><MdQuiz aria-hidden="true" /></span>
            <span className="tile-index">01 / THINK</span>
            <h3>Aptitude practice</h3>
            <p>Sharpen quantitative, verbal, and logical reasoning for assessment rounds.</p>
            <span className="tile-link">Explore aptitude <FaArrowRight aria-hidden="true" /></span>
          </Link>
          <Link to="/coding" className="practice-tile tile-coding">
            <span className="tile-icon"><FaLaptopCode aria-hidden="true" /></span>
            <span className="tile-index">02 / BUILD</span>
            <h3>Coding practice</h3>
            <p>Work through programming challenges and strengthen your problem-solving.</p>
            <span className="tile-link">Explore coding <FaArrowRight aria-hidden="true" /></span>
          </Link>
          <Link to="/interview" className="practice-tile tile-interview">
            <span className="tile-icon"><FaUserTie aria-hidden="true" /></span>
            <span className="tile-index">03 / SPEAK</span>
            <h3>Interview preparation</h3>
            <p>Get ready to talk through your experience, thinking, and technical skills.</p>
            <span className="tile-link">Explore interviews <FaArrowRight aria-hidden="true" /></span>
          </Link>
          <Link to="/progress" className="practice-tile tile-progress">
            <span className="tile-icon"><FaChartLine aria-hidden="true" /></span>
            <span className="tile-index">04 / GROW</span>
            <h3>Progress tracking</h3>
            <p>Review your activity and keep your preparation moving in the right direction.</p>
            <span className="tile-link">View progress <FaArrowRight aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Features;