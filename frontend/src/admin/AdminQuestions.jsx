import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import codingQuestions from "../data/CodingQuestions";
import interviewQuestions from "../data/interviewQuestions";
import aptitudeQuestions from "../data/aptitudeQuestions";
function AdminQuestions() {

    const navigate = useNavigate();

    const emptyForm = {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        category: "Aptitude",
    };

    const [questions, setQuestions] = useState([]);

    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("All");

        const [deletedQuestionIds, setDeletedQuestionIds] =
    useState([]);

    // Load questions
  // Load questions
useEffect(() => {

    const savedQuestions =
        JSON.parse(
            localStorage.getItem("adminQuestions")
        ) || [];

    const savedDeletedIds =
        JSON.parse(
            localStorage.getItem("deletedQuestionIds")
        ) || [];


    const defaultQuestions = [

        ...aptitudeQuestions.map((question) => ({
            ...question,
            category: "Aptitude",
        })),

        ...codingQuestions.map((question) => ({
            ...question,
            category: "Coding",
        })),

        ...interviewQuestions.map((question) => ({
            ...question,
            category: "Interview",
        })),

    ];


    const questionMap = new Map();


    // Add default questions
    defaultQuestions.forEach((question) => {

        if (
            !savedDeletedIds.includes(question.id)
        ) {

            questionMap.set(
                question.id,
                question
            );

        }

    });


    // Add admin questions
    savedQuestions.forEach((question) => {

        if (
            !savedDeletedIds.includes(question.id)
        ) {

            questionMap.set(
                question.id,
                {
                    ...question,

                    // Fix missing category
                    category:
                        question.category ||
                        "Aptitude",
                }
            );

        }

    });


    const allQuestions =
        Array.from(
            questionMap.values()
        );


    setQuestions(allQuestions);

    setDeletedQuestionIds(
        savedDeletedIds
    );


}, []);


    // Handle input
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

    };


    // Add / Update question
    const handleSubmit = (e) => {

        e.preventDefault();

        if (
            !form.question ||
            !form.option1 ||
            !form.option2 ||
            !form.option3 ||
            !form.option4 ||
            !form.answer
        ) {

            alert("Please fill all fields.");

            return;

        }


        const questionData = {

            id:
                editingId ||
                Date.now(),

            question: form.question,

            options: [
                form.option1,
                form.option2,
                form.option3,
                form.option4,
            ],

            answer: form.answer,

            category: form.category,

        };


        let updatedQuestions;


        if (editingId) {

            updatedQuestions =
                questions.map(
                    (question) =>
                        question.id === editingId
                            ? questionData
                            : question
                );

            alert("Question updated successfully ✅");

        } else {

            updatedQuestions = [
                ...questions,
                questionData,
            ];

            alert("Question added successfully ✅");

        }


        setQuestions(updatedQuestions);

        localStorage.setItem(
            "adminQuestions",
            JSON.stringify(updatedQuestions)
        );


        setForm(emptyForm);

        setEditingId(null);

    };


    // Edit question
    const handleEdit = (question) => {

        setEditingId(question.id);

        setForm({

            question: question.question,

            option1: question.options[0],

            option2: question.options[1],

            option3: question.options[2],

            option4: question.options[3],

            answer: question.answer,

            category: question.category,

        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // Delete question
   const handleDelete = (id) => {

    const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this question?"
        );

    if (!confirmDelete) {
        return;
    }


    const updatedQuestions =
        questions.filter(
            (question) =>
                question.id !== id
        );


    const updatedDeletedIds = [
        ...deletedQuestionIds,
        id,
    ];


    setQuestions(
        updatedQuestions
    );


    setDeletedQuestionIds(
        updatedDeletedIds
    );


    localStorage.setItem(
        "adminQuestions",
        JSON.stringify(
            updatedQuestions
        )
    );


    localStorage.setItem(
        "deletedQuestionIds",
        JSON.stringify(
            updatedDeletedIds
        )
    );


    alert(
        "Question deleted successfully 🗑️"
    );

};


    // Cancel edit
    const handleCancelEdit = () => {

        setForm(emptyForm);

        setEditingId(null);

    };


    // Search + category filter
    const filteredQuestions =
        questions.filter((question) => {

            const matchesSearch =
                question.question
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesCategory =
                categoryFilter === "All" ||
                question.category === categoryFilter;

            return (
                matchesSearch &&
                matchesCategory
            );

        });


    // Category count
    const aptitudeCount =
        questions.filter(
            (q) => q.category === "Aptitude"
        ).length;

    const codingCount =
        questions.filter(
            (q) => q.category === "Coding"
        ).length;

    const interviewCount =
        questions.filter(
            (q) => q.category === "Interview"
        ).length;


    return (

        <div className="container mt-5 mb-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold">
                        Question Management ❓
                    </h1>

                    <p className="text-secondary mb-0">
                        Add, edit, search and manage placement questions.
                    </p>

                </div>


                <button
                    className="btn btn-dark"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* Statistics */}

            <div className="row mb-4">

                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Total Questions
                            </small>

                            <h2 className="fw-bold mt-2">
                                {questions.length}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Aptitude
                            </small>

                            <h2 className="fw-bold mt-2 text-primary">
                                {aptitudeCount}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Coding
                            </small>

                            <h2 className="fw-bold mt-2 text-success">
                                {codingCount}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-3 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Interview
                            </small>

                            <h2 className="fw-bold mt-2 text-warning">
                                {interviewCount}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            {/* Add / Edit Form */}

            <div className="card shadow mb-5">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">

                        {editingId
                            ? "✏️ Edit Question"
                            : "➕ Add New Question"}

                    </h4>


                    <form onSubmit={handleSubmit}>

                        {/* Category */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Category
                            </label>

                            <select
                                className="form-select"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            >

                                <option value="Aptitude">
                                    Aptitude
                                </option>

                                <option value="Coding">
                                    Coding
                                </option>

                                <option value="Interview">
                                    Interview
                                </option>

                            </select>

                        </div>


                        {/* Question */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Question
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="question"
                                value={form.question}
                                onChange={handleChange}
                                placeholder="Enter question"
                            />

                        </div>


                        {/* Options */}

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Option 1
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="option1"
                                    value={form.option1}
                                    onChange={handleChange}
                                    placeholder="Enter option 1"
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Option 2
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="option2"
                                    value={form.option2}
                                    onChange={handleChange}
                                    placeholder="Enter option 2"
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Option 3
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="option3"
                                    value={form.option3}
                                    onChange={handleChange}
                                    placeholder="Enter option 3"
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Option 4
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="option4"
                                    value={form.option4}
                                    onChange={handleChange}
                                    placeholder="Enter option 4"
                                />

                            </div>

                        </div>


                        {/* Correct Answer */}

                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Correct Answer
                            </label>

                            <select
                                className="form-select"
                                name="answer"
                                value={form.answer}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select correct answer
                                </option>

                                <option value={form.option1}>
                                    {form.option1 || "Option 1"}
                                </option>

                                <option value={form.option2}>
                                    {form.option2 || "Option 2"}
                                </option>

                                <option value={form.option3}>
                                    {form.option3 || "Option 3"}
                                </option>

                                <option value={form.option4}>
                                    {form.option4 || "Option 4"}
                                </option>

                            </select>

                        </div>


                        {/* Buttons */}

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >

                            {editingId
                                ? "Update Question"
                                : "Add Question"}

                        </button>


                        {editingId && (

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>

                        )}

                    </form>

                </div>

            </div>


            {/* Search + Filter */}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-8 mb-2">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 Search questions..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        <div className="col-md-4 mb-2">

                            <select
                                className="form-select"
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="All">
                                    All Categories
                                </option>

                                <option value="Aptitude">
                                    Aptitude
                                </option>

                                <option value="Coding">
                                    Coding
                                </option>

                                <option value="Interview">
                                    Interview
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            {/* Questions */}

            <div className="card shadow">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>#</th>

                                    <th>Question</th>

                                    <th>Category</th>

                                    <th>Correct Answer</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredQuestions.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center py-5 text-secondary"
                                        >
                                            No questions found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredQuestions.map(
                                        (question, index) => (

                                            <tr key={question.id}>

                                                <td>
                                                    {index + 1}
                                                </td>


                                                <td>

                                                    <strong>
                                                        {question.question}
                                                    </strong>

                                                    <div className="small text-secondary mt-1">

                                                        {question.options.join(
                                                            " | "
                                                        )}

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            question.category ===
                                                            "Aptitude"
                                                                ? "badge bg-primary"
                                                                : question.category ===
                                                                  "Coding"
                                                                    ? "badge bg-success"
                                                                    : "badge bg-warning text-dark"
                                                        }
                                                    >
                                                        {question.category}
                                                    </span>

                                                </td>


                                                <td className="fw-semibold text-success">

                                                    {question.answer}

                                                </td>


                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() =>
                                                            handleEdit(
                                                                question
                                                            )
                                                        }
                                                    >
                                                        ✏️ Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                question.id
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default AdminQuestions;