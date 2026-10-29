import { useNavigate } from "react-router-dom";
import "./Interview.css";

function Interview() {
    const navigate = useNavigate();

    const handleStartLearning = () => {
        navigate("/courses?category=INTERVIEW_PREPARATION");
    };

    return (
        <div className="interview-page">
            <div className="interview-shell">
                <section className="interview-hero" aria-labelledby="interview-title">
                    <div className="interview-hero-copy">
                        <span className="interview-eyebrow">
                            <span className="interview-eyebrow-dot" aria-hidden="true" />
                            Your next opportunity starts here
                        </span>
                        <h1 id="interview-title">Interview Preparation <span>🎤</span></h1>
                        <p>
                            Prepare for technical and HR interviews
                            and improve your confidence.
                        </p>
                    </div>

                    <div className="interview-hero-art" aria-hidden="true">
                        <div className="interview-art-orbit interview-art-orbit-outer" />
                        <div className="interview-art-orbit interview-art-orbit-inner" />
                        <div className="interview-art-mic">🎤</div>
                        <div className="interview-art-note interview-art-note-top">💬</div>
                        <div className="interview-art-note interview-art-note-bottom">✦</div>
                    </div>
                </section>

                <section className="interview-intro interview-panel" aria-labelledby="interview-intro-title">
                    <div className="interview-section-mark" aria-hidden="true">01</div>
                    <div>
                        <span className="interview-section-label">Build your confidence</span>
                        <h2 id="interview-intro-title">What is Interview Preparation?</h2>
                        <p>
                            Interview preparation helps you understand
                            commonly asked technical and HR interview
                            questions.
                        </p>
                        <p>
                            It also helps you improve your communication,
                            confidence and ability to explain technical concepts.
                        </p>
                    </div>
                </section>

                <section className="interview-practice" aria-labelledby="interview-practice-title">
                    <div className="interview-section-heading">
                        <div>
                            <span className="interview-section-label">Practice with purpose</span>
                            <h2 id="interview-practice-title">What Will You Practice? <span>🚀</span></h2>
                        </div>
                    </div>

                    <div className="interview-practice-grid">
                        <article className="interview-practice-card interview-practice-card-hr">
                            <div className="interview-card-icon" aria-hidden="true">💼</div>
                            <span className="interview-card-number">01</span>
                            <h3>HR Questions</h3>
                            <p>
                                Practice common HR questions such as
                                Tell me about yourself and career goals.
                            </p>
                        </article>

                        <article className="interview-practice-card interview-practice-card-tech">
                            <div className="interview-card-icon" aria-hidden="true">💻</div>
                            <span className="interview-card-number">02</span>
                            <h3>Technical Questions</h3>
                            <p>
                                Prepare questions related to Java,
                                React, programming and web development.
                            </p>
                        </article>

                        <article className="interview-practice-card interview-practice-card-confidence">
                            <div className="interview-card-icon" aria-hidden="true">🎯</div>
                            <span className="interview-card-number">03</span>
                            <h3>Interview Confidence</h3>
                            <p>
                                Improve your ability to understand,
                                prepare and answer interview questions.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="interview-benefits interview-panel" aria-labelledby="interview-benefits-title">
                    <div className="interview-benefits-copy">
                        <span className="interview-section-label">Why it matters</span>
                        <h2 id="interview-benefits-title">Why is Interview Preparation Important? <span>🎯</span></h2>
                    </div>
                    <ul className="interview-benefit-list">
                        <li><span aria-hidden="true">✓</span> Improves interview confidence</li>
                        <li><span aria-hidden="true">✓</span> Helps prepare common interview questions</li>
                        <li><span aria-hidden="true">✓</span> Improves technical communication</li>
                        <li><span aria-hidden="true">✓</span> Helps perform better in technical and HR rounds</li>
                    </ul>
                </section>

                <section className="interview-cta" aria-labelledby="interview-cta-title">
                    <div className="interview-cta-decoration" aria-hidden="true">✦</div>
                    <span className="interview-section-label">Take the next step</span>
                    <h2 id="interview-cta-title">Ready for Your Interview? <span>🚀</span></h2>
                    <p>Explore interview lessons, then unlock the related interview tests.</p>
                    <button
                        className="interview-start-button"
                        onClick={handleStartLearning}
                    >
                        Browse Interview Learning 🚀
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Interview;
