
import { useNavigate } from "react-router-dom";

function Interview() {

    // Navigation hook
    const navigate = useNavigate();

    // Start Learning button
    const handleStartLearning = () => {

        // Check whether user is already logged in
        const user = localStorage.getItem("user");

        if (user) {

            // Already logged in
            // Go directly to interview practice
            navigate("/interview-practice");

        } else {

            // Not logged in
            // First go to Login page
            navigate("/login", {
                state: {
                    redirectTo: "/interview-practice"
                }
            });
        }
    };

    return (
        <div className="container mt-5 mb-5">

            {/* Page Heading */}
            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    Interview Preparation 🎤
                </h1>

                <p className="lead mt-3">
                    Prepare for technical and HR interviews
                    and improve your confidence.
                </p>

            </div>


            {/* What is Interview Preparation? */}
            <div className="card shadow-sm mb-4">

                <div className="card-body p-4">

                    <h3 className="fw-bold">
                        What is Interview Preparation?
                    </h3>

                    <p className="mt-3">
                        Interview preparation helps you understand
                        commonly asked technical and HR interview
                        questions.
                    </p>

                    <p>
                        It also helps you improve your communication,
                        confidence and ability to explain technical concepts.
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

                            <h5>💼 HR Questions</h5>

                            <p>
                                Practice common HR questions such as
                                Tell me about yourself and career goals.
                            </p>

                        </div>


                        <div className="col-md-4 mb-3">

                            <h5>💻 Technical Questions</h5>

                            <p>
                                Prepare questions related to Java,
                                React, programming and web development.
                            </p>

                        </div>


                        <div className="col-md-4 mb-3">

                            <h5>🎯 Interview Confidence</h5>

                            <p>
                                Improve your ability to understand,
                                prepare and answer interview questions.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Why Interview Preparation is Important */}
            <div className="card shadow-sm mb-5">

                <div className="card-body p-4">

                    <h3 className="fw-bold mb-4">
                        Why is Interview Preparation Important? 🎯
                    </h3>

                    <ul>

                        <li className="mb-2">
                            Improves interview confidence
                        </li>

                        <li className="mb-2">
                            Helps prepare common interview questions
                        </li>

                        <li className="mb-2">
                            Improves technical communication
                        </li>

                        <li>
                            Helps perform better in technical and HR rounds
                        </li>

                    </ul>

                </div>

            </div>


            {/* Start Learning */}
            <div className="text-center">

                <h3 className="fw-bold">
                    Ready for Your Interview? 🚀
                </h3>

                <p className="mt-2">
                    Login or register to start your interview preparation.
                </p>

                <button
                    className="btn btn-warning btn-lg mt-2"
                    onClick={handleStartLearning}
                >
                    Start Learning 🚀
                </button>

            </div>

        </div>
    );
}

export default Interview;

