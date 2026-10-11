import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="home-container">
        <div className="footer-main">
          <div className="footer-about">
            <Link className="footer-brand" to="/">jobready<span>.</span></Link>
            <p>A little practice today can change how you show up tomorrow.</p>
          </div>
          <div className="footer-links">
            <span className="footer-label">Explore</span>
            <Link to="/aptitude">Aptitude</Link>
            <Link to="/coding">Coding</Link>
            <Link to="/interview">Interview prep</Link>
          </div>
          <div className="footer-links">
            <span className="footer-label">Your account</span>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 JobReady</span>
          <span>Made for the next generation of professionals.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;