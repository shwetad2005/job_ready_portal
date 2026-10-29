// React Router Hook
import { useNavigate } from "react-router-dom";

function Aptitude() {

    // Navigation hook
    const navigate = useNavigate();


    // Start the learning path for aptitude
    const handleStartPractice = () => {
        navigate("/courses?category=APTITUDE");
    };


    return (
        <div className="container mt-5 mb-5">

            {/* Page Heading */}
            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    Aptitude Preparation 📚
                </h1>

                <p className="lead mt-3">
                    Prepare yourself for aptitude tests commonly
                    asked in placement examinations.
                </p>

            </div>


            {/* What is Aptitude? */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold">
                        What is Aptitude?
                    </h3>

                    <p className="mt-3">
                        Aptitude is a test used by companies to
                        evaluate a candidate's problem-solving,
                        mathematical and reasoning abilities.
                    </p>

                    <p>
                        Aptitude preparation helps you improve your
                        speed, accuracy and logical thinking skills
                        for placement examinations.
                    </p>

                </div>

            </div>


            {/* Practice Areas */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        What Will You Practice?
                    </h3>

                    <div className="row">

                        {/* Quantitative */}
                        <div className="col-md-4 mb-3">

                            <h5>📊 Quantitative Aptitude</h5>

                            <p>
                                Numbers, percentages, averages,
                                ratios and mathematical problems.
                            </p>

                        </div>


                        {/* Logical */}
                        <div className="col-md-4 mb-3">

                            <h5>🧩 Logical Reasoning</h5>

                            <p>
                                Patterns, sequences, puzzles and
                                logical reasoning problems.
                            </p>

                        </div>


                        {/* Verbal */}
                        <div className="col-md-4 mb-3">

                            <h5>📖 Verbal Ability</h5>

                            <p>
                                Vocabulary, grammar, comprehension
                                and verbal ability questions.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Why Aptitude? */}
            <div className="card shadow-sm mb-5">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        Why is Aptitude Important? 🎯
                    </h3>

                    <ul>

                        <li className="mb-2">
                            Improves problem-solving skills
                        </li>

                        <li className="mb-2">
                            Improves speed and accuracy
                        </li>

                        <li className="mb-2">
                            Helps prepare for placement tests
                        </li>

                        <li>
                            Builds confidence before aptitude rounds
                        </li>

                    </ul>

                </div>

            </div>


            {/* Start Practice */}
            <div className="text-center">

                <h3 className="fw-bold">
                    Ready to Practice? 🚀
                </h3>

                <p className="mt-2">
                    Explore an aptitude course, study its lessons, then unlock its tests.
                </p>

                {/* Start Practice Button */}
                <button
                    className="btn btn-primary btn-lg mt-2"
                    onClick={handleStartPractice}
                >
                    Browse Aptitude Learning
                </button>

            </div>

        </div>
    );
}

export default Aptitude;
