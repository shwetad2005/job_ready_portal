import { Link } from "react-router-dom";
import { FaBolt } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg site-nav">
      <div className="home-container nav-inner">
        <Link className="navbar-brand site-brand" to="/" aria-label="JobReady home">
          <span className="brand-icon"><FaBolt aria-hidden="true" /></span>
          <span>jobready<span className="brand-period">.</span></span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/aptitude">Aptitude</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coding">Coding</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/interview">Interview prep</Link>
            </li>
            <li className="nav-item">
    <Link
        className="nav-link"
        to="/leaderboard"
        title="View weekly test rankings and student performance"
    >
        🏆 Leaderboard
    </Link>
</li>
          </ul>
          <div className="nav-actions">
            <Link className="nav-login" to="/login">Log in</Link>
            <Link className="nav-signup" to="/register">Create account <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;