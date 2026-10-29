
import { useNavigate } from "react-router-dom";

function Coding() {

    // Navigation hook
    const navigate = useNavigate();

    // Start the learning path for coding
    const handleStartLearning = () => {
        navigate("/courses?category=CODING");
    };

    return (
        <div className="container mt-5 mb-5">

            {/* Page Heading */}
            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    Coding Preparation 💻
                </h1>

                <p className="lead mt-3">
                    Improve your programming skills and prepare
                    for coding rounds in placement examinations.
                </p>

            </div>


            {/* What is Coding Preparation? */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold">
                        What is Coding Preparation?
                    </h3>

                    <p className="mt-3">
                        Coding preparation helps you improve your
                        programming knowledge, problem-solving skills
                        and logical thinking.
                    </p>

                    <p>
                        It is useful for technical interviews and
                        coding assessment rounds conducted by companies.
                    </p>

                </div>

            </div>


            {/* What will you practice? */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        What Will You Practice? 🚀
                    </h3>

                    <div className="row">

                        <div className="col-md-4 mb-3">

                            <h5>💡 Programming Basics</h5>

                            <p>
                                Learn variables, data types,
                                functions, operators and basic
                                programming concepts.
                            </p>

                        </div>


                        <div className="col-md-4 mb-3">

                            <h5>🧩 Problem Solving</h5>

                            <p>
                                Practice programming problems and
                                improve your logical thinking.
                            </p>

                        </div>


                        <div className="col-md-4 mb-3">

                            <h5>💻 Coding Questions</h5>

                            <p>
                                Practice coding questions commonly
                                asked in technical placement rounds.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Why Coding is Important */}
            <div className="card shadow-sm mb-5">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        Why is Coding Important? 🎯
                    </h3>

                    <ul>

                        <li className="mb-2">
                            Improves problem-solving skills
                        </li>

                        <li className="mb-2">
                            Builds programming confidence
                        </li>

                        <li className="mb-2">
                            Helps prepare for coding assessments
                        </li>

                        <li>
                            Helps in technical interviews
                        </li>

                    </ul>

                </div>

            </div>


            {/* Start Learning */}
            <div className="text-center">

                <h3 className="fw-bold">
                    Ready to Start Coding? 🚀
                </h3>

                <p className="mt-2">
                    Explore coding lessons, then unlock the related coding tests.
                </p>

                <button
                    className="btn btn-success btn-lg mt-2"
                    onClick={handleStartLearning}
                >
                    Browse Coding Learning 🚀
                </button>

            </div>

        </div>
    );
}

export default Coding;

