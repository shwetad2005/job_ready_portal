import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import weeklyQuestions from "../data/weeklyQuestions";
import codingQuestions from "../data/CodingQuestions";
import interviewQuestions from "../data/interviewQuestions";

function WeeklyTest() {

    const navigate = useNavigate();

    // Test settings
    const [testSettings, setTestSettings] = useState(null);

    // Questions
    const [questions, setQuestions] = useState([]);

    // Current question
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // User answers
    const [answers, setAnswers] = useState([]);

    // Timer in seconds
    const [timeLeft, setTimeLeft] = useState(0);

    // Prevent duplicate submit
    const submittedRef = useRef(false);


    // =====================================================
    // LOAD TEST SETTINGS + QUESTIONS
    // =====================================================

    useEffect(() => {

        // Get Admin test settings
        const savedSettings =
            JSON.parse(
                localStorage.getItem("weeklyTestSettings")
            );


        // Get Admin added questions
        const adminQuestions =
            JSON.parse(
                localStorage.getItem("adminQuestions")
            ) || [];


        // Default settings
        const settings = savedSettings || {

            title: "Weekly Placement Test",

            duration: 30,

            questionLimit: 10,

            category: "All",

            active: true,

        };


        setTestSettings(settings);


        // =================================================
        // COMBINE ALL QUESTIONS
        // =================================================

        const allQuestions = [

            ...weeklyQuestions,

            ...codingQuestions,

            ...interviewQuestions,

            ...adminQuestions,

        ];


        // Remove duplicate questions by ID
        const uniqueQuestions = Array.from(

            new Map(
                allQuestions.map(
                    (question) => [
                        question.id,
                        question
                    ]
                )
            ).values()

        );


        let availableQuestions = [];


        // =================================================
        // ADMIN SELECTED QUESTIONS
        // =================================================

        if (
            settings.selectedQuestionIds &&
            settings.selectedQuestionIds.length > 0
        ) {

            availableQuestions =
                settings.selectedQuestionIds

                    .map((id) =>

                        uniqueQuestions.find(
                            (question) =>
                                question.id === id
                        )

                    )

                    .filter(Boolean);

        }

        // =================================================
        // OTHERWISE USE CATEGORY
        // =================================================

        else {

            availableQuestions =
                uniqueQuestions;

        }


        // =================================================
        // CATEGORY FILTER
        // =================================================

        if (
            settings.category &&
            settings.category !== "All"
        ) {

            availableQuestions =
                availableQuestions.filter(
                    (question) =>
                        question.category ===
                        settings.category
                );

        }


        // =================================================
        // QUESTION LIMIT
        // =================================================

        const selectedQuestions =
            availableQuestions.slice(
                0,
                Number(settings.questionLimit)
            );


        setQuestions(selectedQuestions);


        // Create empty answer array

        setAnswers(
            Array(
                selectedQuestions.length
            ).fill("")
        );


        // =================================================
        // SET TIMER
        // =================================================

        setTimeLeft(
            Number(settings.duration) * 60
        );

    }, []);


    // =====================================================
    // TIMER
    // =====================================================

    useEffect(() => {

        if (

            !testSettings ||

            questions.length === 0 ||

            timeLeft <= 0 ||

            submittedRef.current

        ) {

            return;

        }


        const timer =
            setInterval(() => {

                setTimeLeft(
                    (previousTime) =>
                        previousTime - 1
                );

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [
        timeLeft,
        testSettings,
        questions.length
    ]);


    // =====================================================
    // AUTO SUBMIT
    // =====================================================

    useEffect(() => {

        if (

            testSettings &&

            questions.length > 0 &&

            timeLeft === 0 &&

            !submittedRef.current

        ) {

            handleSubmit();

        }

    }, [
        timeLeft,
        testSettings,
        questions.length
    ]);


    // =====================================================
    // LOADING
    // =====================================================

    if (!testSettings) {

        return (

            <div className="container mt-5 text-center">

                <div className="spinner-border text-primary">
                </div>

                <h4 className="mt-3">
                    Loading Weekly Test...
                </h4>

            </div>

        );

    }


    // =====================================================
    // TEST NOT ACTIVE
    // =====================================================

    if (!testSettings.active) {

        return (

            <div className="container mt-5">

                <div className="card shadow p-5 text-center">

                    <h2 className="fw-bold">
                        Weekly Test is Unavailable 🔒
                    </h2>

                    <p className="text-secondary mt-3">

                        The administrator has not
                        published this week's test yet.

                    </p>

                    <button
                        className="btn btn-primary mt-3"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // NO QUESTIONS
    // =====================================================

    if (questions.length === 0) {

        return (

            <div className="container mt-5">

                <div className="card shadow p-5 text-center">

                    <h3 className="fw-bold">
                        No Questions Available
                    </h3>

                    <p className="text-secondary mt-3">

                        No questions are available
                        for this weekly test.

                    </p>

                    <button
                        className="btn btn-primary mt-3"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // Current question

    const question =
        questions[currentQuestion];


    // Timer minutes

    const minutes =
        Math.floor(timeLeft / 60);


    // Timer seconds

    const seconds =
        timeLeft % 60;


    // =====================================================
    // SELECT ANSWER
    // =====================================================

    const handleOptionSelect = (option) => {

        const updatedAnswers =
            [...answers];


        updatedAnswers[currentQuestion] =
            option;


        setAnswers(updatedAnswers);

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
    // SUBMIT TEST
    // =====================================================

    function handleSubmit() {

        // Prevent duplicate submission

        if (submittedRef.current) {

            return;

        }


        submittedRef.current = true;


        let score = 0;


        // Calculate score

        questions.forEach(
            (question, index) => {

                if (
                    answers[index] ===
                    question.answer
                ) {

                    score++;

                }

            }
        );


        // Navigate to result

        navigate(
            "/weekly-result",
            {

                state: {

                    score: score,

                    total: questions.length,

                },

                replace: true,

            }
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="container mt-5 mb-5">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        {testSettings.title} 📝

                    </h2>

                    <p className="text-secondary mb-0">

                        Test your placement preparation skills.

                    </p>

                </div>


                {/* TIMER */}

                <div
                    className={
                        timeLeft <= 60
                            ? "card shadow-sm border-danger px-4 py-2"
                            : "card shadow-sm px-4 py-2"
                    }
                >

                    <h5
                        className={
                            timeLeft <= 60
                                ? "mb-0 text-danger fw-bold"
                                : "mb-0 text-primary fw-bold"
                        }
                    >

                        ⏱️{" "}

                        {String(minutes).padStart(
                            2,
                            "0"
                        )}

                        :

                        {String(seconds).padStart(
                            2,
                            "0"
                        )}

                    </h5>

                </div>

            </div>


            {/* ==========================================
                PROGRESS
            ========================================== */}

            <div className="mb-4">

                <div className="d-flex justify-content-between mb-2">

                    <span className="fw-semibold">

                        Question{" "}

                        {currentQuestion + 1}

                        {" "}of{" "}

                        {questions.length}

                    </span>


                    <span className="text-secondary">

                        {Math.round(

                            (

                                (currentQuestion + 1) /

                                questions.length

                            ) * 100

                        )}%

                    </span>

                </div>


                <div className="progress">

                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width:
                                `${
                                    (
                                        (currentQuestion + 1) /
                                        questions.length
                                    ) * 100
                                }%`
                        }}
                    />

                </div>

            </div>


            {/* ==========================================
                QUESTION CARD
            ========================================== */}

            <div className="card shadow p-4">

                {/* QUESTION HEADER */}

                <div className="d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">

                        Question{" "}

                        {currentQuestion + 1}

                        {" "}of{" "}

                        {questions.length}

                    </h5>


                    {/* CATEGORY */}

                    {question.category && (

                        <span className="badge bg-primary">

                            {question.category}

                        </span>

                    )}

                </div>


                <hr />


                {/* QUESTION */}

                <h4 className="mt-3">

                    {question.question}

                </h4>


                {/* ======================================
                    OPTIONS
                ====================================== */}

                <div className="mt-4">

                    {question.options.map(
                        (option, index) => (

                            <div
                                key={index}
                                className="form-check border rounded p-3 mb-3"
                                style={{
                                    cursor: "pointer"
                                }}
                            >

                                <input
                                    className="form-check-input ms-1"
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={
                                        answers[
                                            currentQuestion
                                        ] === option
                                    }
                                    onChange={() =>
                                        handleOptionSelect(
                                            option
                                        )
                                    }
                                />

                                <label className="form-check-label ms-2">

                                    {option}

                                </label>

                            </div>

                        )
                    )}

                </div>


                {/* ======================================
                    NAVIGATION BUTTONS
                ====================================== */}

                <div className="d-flex justify-content-between mt-4">

                    {/* PREVIOUS */}

                    <button
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                        disabled={
                            currentQuestion === 0
                        }
                    >

                        ← Previous

                    </button>


                    {/* NEXT / SUBMIT */}

                    {currentQuestion ===
                    questions.length - 1 ? (

                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >

                            Submit Test ✓

                        </button>

                    ) : (

                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                        >

                            Next →

                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}

export default WeeklyTest;