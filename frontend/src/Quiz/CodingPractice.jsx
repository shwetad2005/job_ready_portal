import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import codingQuestions from "../data/CodingQuestions";

function CodingPractice() {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [testFinished, setTestFinished] = useState(false);


    // =====================================================
    // LOAD CODING QUESTIONS
    // =====================================================

    useEffect(() => {

        // Default Coding Questions
        const defaultQuestions =
            codingQuestions.map((question) => ({
                ...question,
                category: "Coding"
            }));


        // Admin Questions
        const adminQuestions =
            JSON.parse(
                localStorage.getItem("adminQuestions")
            ) || [];


        // Only Coding questions added by Admin
        const codingAdminQuestions =
            adminQuestions.filter(
                (question) =>
                    question.category === "Coding"
            );


        // =====================================================
        // REMOVE DUPLICATE QUESTIONS
        // =====================================================

        const combinedQuestions = [
            ...defaultQuestions,
            ...codingAdminQuestions
        ];


        const uniqueQuestions = [];

        const seenQuestions = new Set();


        combinedQuestions.forEach((question) => {

            // Use question text as unique identifier
            const questionKey =
                question.question
                    ?.trim()
                    .toLowerCase();


            if (
                questionKey &&
                !seenQuestions.has(questionKey)
            ) {

                seenQuestions.add(questionKey);

                uniqueQuestions.push(question);

            }

        });


        setQuestions(uniqueQuestions);

    }, []);


    // =====================================================
    // TIMER
    // =====================================================

    useEffect(() => {

        if (
            timeLeft <= 0 ||
            testFinished
        ) {
            return;
        }


        const timer = setInterval(() => {

            setTimeLeft(
                (previous) => previous - 1
            );

        }, 1000);


        return () => clearInterval(timer);

    }, [timeLeft, testFinished]);


    // =====================================================
    // TIMER FORMAT
    // =====================================================

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    // =====================================================
    // SELECT ANSWER
    // =====================================================

    const handleAnswer = (answer) => {

        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: answer
        });

    };


    // =====================================================
    // NEXT
    // =====================================================

    const handleNext = () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        }

    };


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

        }

    };


    // =====================================================
    // SUBMIT TEST
    // =====================================================

    const handleSubmit = () => {

        if (testFinished) {
            return;
        }


        let score = 0;


        // Check correct answers
        questions.forEach(
            (question, index) => {

                if (
                    selectedAnswers[index] ===
                    question.answer
                ) {

                    score++;

                }

            }
        );


        // =====================================================
        // CURRENT USER
        // =====================================================

        const currentUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        const studentName =
            currentUser?.fullName ||
            "Unknown Student";


        const studentEmail =
            currentUser?.email ||
            "";


        // =====================================================
        // PERCENTAGE
        // =====================================================

        const percentage =
            questions.length > 0
                ? Math.round(
                    (score / questions.length) * 100
                )
                : 0;


        // =====================================================
        // RESULT
        // =====================================================

        const newResult = {

            id: Date.now(),

            name: studentName,

            fullName: studentName,

            email: studentEmail,

            category: "Coding",

            testName: "Coding Test",

            score: score,

            total: questions.length,

            percentage: percentage,

            date: new Date().toLocaleString()

        };


        // =====================================================
        // SAVE RESULT
        // =====================================================

        const previousResults =
            JSON.parse(
                localStorage.getItem("weeklyScores")
            ) || [];


        previousResults.push(newResult);


        localStorage.setItem(
            "weeklyScores",
            JSON.stringify(previousResults)
        );


        setTestFinished(true);


        // =====================================================
        // GO TO RESULT
        // =====================================================

        navigate("/result", {

            state: {

                studentName: studentName,

                category: "Coding",

                score: score,

                total: questions.length,

                percentage: percentage

            }

        });

    };


    // =====================================================
    // NO QUESTIONS
    // =====================================================

    if (questions.length === 0) {

        return (

            <div className="container mt-5">

                <div className="alert alert-warning text-center">

                    <h4>
                        No Coding Questions Found
                    </h4>

                    <p>
                        Please add Coding questions
                        from Admin Questions.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // CURRENT QUESTION
    // =====================================================

    const question =
        questions[currentQuestion];


    return (

        <div className="container mt-4 mb-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Coding Practice 💻
                    </h2>

                    <p className="text-muted mb-0">
                        Test your programming knowledge
                    </p>

                </div>


                <div className="badge bg-dark fs-6 p-3">

                    ⏱️{" "}

                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}

                </div>

            </div>


            {/* PROGRESS */}

            <div className="progress mb-4">

                <div
                    className="progress-bar bg-success"
                    style={{
                        width:
                            `${((currentQuestion + 1) /
                                questions.length) * 100}%`
                    }}
                >

                    {currentQuestion + 1}
                    {" / "}
                    {questions.length}

                </div>

            </div>


            {/* QUESTION */}

            <div className="card shadow border-0">

                <div className="card-body p-4">

                    <h5 className="text-success fw-bold">

                        Question {currentQuestion + 1}

                    </h5>


                    <h4 className="fw-bold mt-3 mb-4">

                        {question.question}

                    </h4>


                    {/* OPTIONS */}

                    {question.options.map(
                        (option, index) => (

                            <button
                                key={index}
                                type="button"
                                onClick={() =>
                                    handleAnswer(option)
                                }
                                className={
                                    `btn w-100 text-start mb-3 p-3 ${
                                        selectedAnswers[
                                            currentQuestion
                                        ] === option
                                            ? "btn-success"
                                            : "btn-outline-secondary"
                                    }`
                                }
                            >

                                <strong>
                                    {String.fromCharCode(
                                        65 + index
                                    )}.
                                </strong>

                                {" "}

                                {option}

                            </button>

                        )
                    )}


                    {/* NAVIGATION */}

                    <div className="d-flex justify-content-between mt-4">

                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevious}
                            disabled={
                                currentQuestion === 0
                            }
                        >

                            ← Previous

                        </button>


                        {currentQuestion <
                        questions.length - 1 ? (

                            <button
                                className="btn btn-primary"
                                onClick={handleNext}
                            >

                                Next →

                            </button>

                        ) : (

                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                            >

                                Submit Test ✓

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* QUESTION NAVIGATOR */}

            <div className="card shadow-sm border-0 mt-4">

                <div className="card-body">

                    <h6 className="fw-bold mb-3">
                        Questions
                    </h6>


                    <div className="d-flex flex-wrap gap-2">

                        {questions.map(
                            (item, index) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        setCurrentQuestion(
                                            index
                                        )
                                    }
                                    className={
                                        `btn btn-sm ${
                                            currentQuestion === index
                                                ? "btn-primary"
                                                : selectedAnswers[index]
                                                    ? "btn-success"
                                                    : "btn-outline-secondary"
                                        }`
                                    }
                                >

                                    {index + 1}

                                </button>

                            )
                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CodingPractice;