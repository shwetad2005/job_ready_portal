import Hero from "./Hero";
import Features from "./Features";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <Hero />
            <Features />
            <section className="home-method" aria-labelledby="method-title">
                <div className="home-container method-layout">
                    <div className="method-intro">
                        <span className="section-kicker">A better practice rhythm</span>
                        <h2 id="method-title">Small sessions.<br />Real momentum.</h2>
                        <p>Make preparation part of your week, not a last-minute scramble.</p>
                    </div>
                    <div className="method-steps">
                        <article className="method-step">
                            <span className="step-number">01</span>
                            <div>
                                <h3>Pick a focus</h3>
                                <p>Choose the skill you want to strengthen today.</p>
                            </div>
                        </article>
                        <article className="method-step">
                            <span className="step-number">02</span>
                            <div>
                                <h3>Work through it</h3>
                                <p>Practice with questions made for placement prep.</p>
                            </div>
                        </article>
                        <article className="method-step">
                            <span className="step-number">03</span>
                            <div>
                                <h3>Come back sharper</h3>
                                <p>Use your progress to decide what to tackle next.</p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
            <section className="home-cta">
                <div className="home-container cta-layout">
                    <div>
                        <span className="section-kicker">Your next step starts here</span>
                        <h2>Show up ready<br />for what’s next.</h2>
                    </div>
                    <Link className="cta-link" to="/register">
                        Create your account <span aria-hidden="true">↗</span>
                    </Link>
                </div>
            </section>
        </>
    );
}

export default Home;