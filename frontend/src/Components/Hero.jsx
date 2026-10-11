// Hero section Component
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa";

function Hero() {
  return (
    <section className="home-hero">
      <div className="home-container hero-layout">
        <div className="hero-copy">
          <span className="hero-eyebrow"><span className="eyebrow-dot" /> A smarter way to prepare</span>
          <h1>Make your next<br />move <span>count.</span></h1>
          <p className="hero-description">
            Build the skills and confidence to take on placement tests, coding rounds, and interviews.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="button-primary">
              Start your prep <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to="/aptitude" className="button-secondary">Explore practice</Link>
          </div>
          <div className="hero-assurances">
            <span><FaCheck aria-hidden="true" /> Aptitude drills</span>
            <span><FaCheck aria-hidden="true" /> Coding practice</span>
            <span><FaCheck aria-hidden="true" /> Interview prep</span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
            alt="Students collaborating around a laptop"
            fetchPriority="high"
          />
          <div className="hero-photo-caption">
            <span className="caption-mark" aria-hidden="true">J</span>
            <span><strong>Ready is a practice.</strong><small>Make time for your next step.</small></span>
          </div>
          <div className="hero-image-note"><span className="note-pulse" /> Your future, in progress</div>
        </div>
      </div>
      <div className="hero-bottomline"><span>LEARN WITH INTENTION</span><span>PREPARE WITH PURPOSE</span><span>STEP IN WITH CONFIDENCE</span></div>
    </section>
  );
}

export default Hero;