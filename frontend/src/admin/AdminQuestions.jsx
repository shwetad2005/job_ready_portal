import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import * as XLSX from "xlsx";

const testCategories = [
    { value: "APTITUDE", label: "Aptitude" },
    { value: "CODING", label: "Coding" },
    { value: "INTERVIEW_PREPARATION", label: "Interview Preparation" },
];

function AdminQuestions() {

    const navigate = useNavigate();

    const emptyForm = {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        marks: 1,
    };

    const emptyTestForm = {
        title: "",
        description: "",
        category: "APTITUDE",
        deadline: "",
        durationMinutes: 60,
        totalMarks: 50,
        marksPerQuestion: 1,
        isActive: true,
        isPublished: false,
    };

    const [questions, setQuestions] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [reusableQuestions, setReusableQuestions] = useState([]);
    const [selectedReusableQuestionIds, setSelectedReusableQuestionIds] = useState([]);
    const [isLoadingReusable, setIsLoadingReusable] = useState(false);
    const [isCopyingQuestions, setIsCopyingQuestions] = useState(false);
    const [reuseError, setReuseError] = useState("");

    const [form, setForm] = useState(emptyForm);
    const [testForm, setTestForm] = useState(emptyTestForm);

    const [editingId, setEditingId] = useState(null);
    const [editingTestId, setEditingTestId] = useState(null);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [showTestModal, setShowTestModal] = useState(false);
    const [viewMode, setViewMode] = useState("tests"); // "tests" or "questions"
    const [excelFile, setExcelFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Load questions and tests from backend
    useEffect(() => {
        fetchQuestions();
        fetchTests();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await api.get("/questions");

            const formattedQuestions = response.data.map((q) => ({
                id: q.id,
                question: q.questionText,
                options: [
                    q.optionA || "",
                    q.optionB || "",
                    q.optionC || "",
                    q.optionD || "",
                ],
                answer: q.correctAnswer || "",
                category: q.category || "Aptitude",
                explanation: q.explanation || "",
                marks: q.marks ?? 1,
                testId: q.test?.id,
            }));

            setQuestions(formattedQuestions);
        } catch (error) {
            console.error("Error loading questions:", error);
            alert("Failed to load questions.");
        }
    };

    const fetchTests = async () => {
        try {
            const response = await api.get("/tests");
            console.log("Tests response:", response.data);
            if (Array.isArray(response.data)) {
                setTests(response.data);
            } else {
                console.error("Tests data is not an array:", response.data);
                setTests([]);
            }
        } catch (error) {
            console.error("Error loading tests:", error);
            alert("Failed to load tests.");
            setTests([]);
        }
    };

    const fetchQuestionsByTest = async (testId) => {
        try {
            setIsLoadingReusable(true);
            setReuseError("");
            const [response, reusableResponse] = await Promise.all([
                api.get(`/questions/test/${testId}`),
                api.get(`/questions/reusable/test/${testId}`),
            ]);

            const formattedQuestions = response.data.map((q) => ({
                id: q.id,
                question: q.questionText,
                options: [
                    q.optionA || "",
                    q.optionB || "",
                    q.optionC || "",
                    q.optionD || "",
                ],
                answer: q.correctAnswer || "",
                category: q.category || "Aptitude",
                explanation: q.explanation || "",
                marks: q.marks ?? 1,
                testId: q.test?.id,
            }));

            setQuestions(formattedQuestions);
            setReusableQuestions(reusableResponse.data);
            setSelectedReusableQuestionIds([]);
            setSelectedTest(testId);
            setViewMode("questions");
        } catch (error) {
            console.error("Error loading test questions:", error);
            alert("Failed to load test questions.");
        } finally {
            setIsLoadingReusable(false);
        }
    };

    const handleReuseQuestions = async () => {
        if (selectedReusableQuestionIds.length === 0) {
            return;
        }

        setIsCopyingQuestions(true);
        setReuseError("");

        try {
            await api.post(
                `/questions/copy-to-test/${selectedTest}`,
                selectedReusableQuestionIds
            );
            await fetchQuestionsByTest(selectedTest);
            await fetchTests(); // Refresh tests to update total marks and duration
        } catch (error) {
            console.error("Error reusing questions:", error);
            setReuseError(
                error.response?.data?.message ||
                (error.response?.status === 400
                    ? "One or more selected questions are already in this test."
                    : "Unable to add the selected questions to the test.")
            );
        } finally {
            setIsCopyingQuestions(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]: type === "number" ? parseInt(value) || 0 : value,
        });
    };

    const handleTestChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTestForm({
            ...testForm,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.question.trim() ||
            !form.option1.trim() ||
            !form.option2.trim() ||
            !form.option3.trim() ||
            !form.option4.trim() ||
            !form.answer
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        // Get the test's marks per question if adding to a test
        const test = tests.find((t) => t.id === selectedTest);
        const defaultMarks = test?.marksPerQuestion || 1;

        const questionData = {
            questionText: form.question,
            optionA: form.option1,
            optionB: form.option2,
            optionC: form.option3,
            optionD: form.option4,
            correctAnswer: form.answer,
            marks: form.marks || defaultMarks,
        };

        if (selectedTest) {
            questionData.testId = selectedTest;
        }

        try {
            if (editingId) {
                await api.put(`/questions/${editingId}`, questionData);
                alert("Question updated successfully!");
            } else {
                await api.post("/questions", questionData);
                alert("Question added successfully!");
            }

            if (selectedTest) {
                await fetchQuestionsByTest(selectedTest);
                await fetchTests(); // Refresh tests to update total marks and duration
            } else {
                await fetchQuestions();
            }

            setForm(emptyForm);
            setEditingId(null);
        } catch (error) {
            console.error("Error saving question:", error);
            alert("Failed to save the question.");
        }
    };

    const handleTestSubmit = async (e) => {
        e.preventDefault();

        if (!testForm.title.trim() || !testForm.deadline) {
            alert("Please fill in all required fields.");
            return;
        }

        const testData = {
            ...testForm,
            deadline: new Date(testForm.deadline).toISOString(),
        };

        try {
            if (editingTestId) {
                await api.put(`/tests/${editingTestId}`, testData);
                alert("Test updated successfully!");
            } else {
                await api.post("/tests", testData);
                alert("Test created successfully!");
            }

            await fetchTests();
            setShowTestModal(false);
            setTestForm(emptyTestForm);
            setEditingTestId(null);
        } catch (error) {
            console.error("Error saving test:", error);
            alert("Failed to save the test.");
        }
    };

    const handlePublishTest = async (testId) => {
        try {
            await api.post(`/tests/${testId}/publish`);
            alert("Test published successfully!");
            await fetchTests();
        } catch (error) {
            console.error("Error publishing test:", error);
            alert("Failed to publish the test.");
        }
    };

    const handleEditTest = (test) => {
        setEditingTestId(test.id);
        setTestForm({
            title: test.title,
            description: test.description,
            category: test.category || "APTITUDE",
            deadline: test.deadline ? test.deadline.slice(0, 16) : "",
            durationMinutes: test.durationMinutes,
            totalMarks: test.totalMarks,
            marksPerQuestion: test.marksPerQuestion || 1,
            isActive: test.isActive,
            isPublished: test.isPublished,
        });
        setShowTestModal(true);
    };

    const handleDeleteTest = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this test? All questions in this test will also be deleted."
        );

        if (!confirmDelete) return;

        try {
            console.log("Deleting test with ID:", id);
            const response = await api.delete(`/tests/${id}`);
            console.log("Delete response:", response);
            alert("Test deleted successfully!");
            await fetchTests();
            if (selectedTest === id) {
                setSelectedTest(null);
                await fetchQuestions();
            }
        } catch (error) {
            console.error("Error deleting test:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
                alert(`Failed to delete the test: ${error.response.data.message || error.message}`);
            } else {
                alert(`Failed to delete the test: ${error.message}`);
            }
        }
    };

    const handleEdit = (question) => {
        setEditingId(question.id);
        setForm({
            question: question.question,
            option1: question.options[0] || "",
            option2: question.options[1] || "",
            option3: question.options[2] || "",
            option4: question.options[3] || "",
            answer: question.answer,
            marks: question.marks || 1,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this question?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/questions/${id}`);
            alert("Question deleted successfully!");
            if (selectedTest) {
                await fetchQuestionsByTest(selectedTest);
                await fetchTests(); // Refresh tests to update total marks and duration
            } else {
                await fetchQuestions();
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete the question.");
        }
    };

    const handleCancelEdit = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const closeTestModal = () => {
        setShowTestModal(false);
        setTestForm(emptyTestForm);
        setEditingTestId(null);
    };

    const handleExcelUpload = async () => {
        if (!excelFile) {
            alert("Please select an Excel file first.");
            return;
        }

        if (!selectedTest) {
            alert("Please select a test first before importing questions.");
            return;
        }

        setUploading(true);

        try {
            const data = await excelFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const questionsToImport = jsonData.map((row, index) => ({
                questionText: row["Question"] || row["question"] || row["Question Text"] || "",
                category: row["Category"] || row["category"] || testCategories.find(({ value }) => value === selectedTest?.category)?.label || "Aptitude",
                optionA: row["Option A"] || row["optionA"] || row["Option A"] || "",
                optionB: row["Option B"] || row["optionB"] || row["Option B"] || "",
                optionC: row["Option C"] || row["optionC"] || row["Option C"] || "",
                optionD: row["Option D"] || row["optionD"] || row["Option D"] || "",
                correctAnswer: row["Correct Answer"] || row["correctAnswer"] || row["Answer"] || row["Correct Answer"] || "",
                explanation: row["Explanation"] || row["explanation"] || "",
                marks: parseInt(row["Marks"] || row["marks"] || "1") || 1,
                testId: selectedTest,
            })).filter(q => q.questionText && q.optionA && q.optionB && q.optionC && q.optionD && q.correctAnswer);

            if (questionsToImport.length === 0) {
                alert("No valid questions found in the Excel file. Please ensure your Excel has columns: Question, Option A, Option B, Option C, Option D, Correct Answer, Category, Marks, Explanation");
                setUploading(false);
                return;
            }

            const response = await api.post("/questions/bulk", {
                questions: questionsToImport,
            });

            alert(`Successfully imported ${questionsToImport.length} questions!`);
            await fetchQuestionsByTest(selectedTest);
            await fetchTests(); // Refresh tests to update total marks and duration
            setExcelFile(null);
            document.getElementById("excelUpload").value = "";
        } catch (error) {
            console.error("Error importing questions:", error);
            alert("Failed to import questions. Please check the Excel file format.");
        } finally {
            setUploading(false);
        }
    };

    const filteredQuestions = questions.filter((question) => {
        const matchesSearch =
            question.question
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            categoryFilter === "All" ||
            question.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const selectedTestCategory =
        tests.find((test) => test.id === selectedTest)?.category || "APTITUDE";
    const selectedTestIsPublished = tests.find(
        (test) => test.id === selectedTest
    )?.isPublished === true;
    const selectedTestCategoryLabel =
        testCategories.find(({ value }) => value === selectedTestCategory)?.label || "Aptitude";

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleString();
    };

    // Calculate max questions and duration based on test form values
    const calculateTestStats = (totalMarks, marksPerQuestion) => {
        const maxQuestions = totalMarks / marksPerQuestion;
        // For 50-mark tests, use 60 minutes. For others, use 1 minute per question minimum
        const duration = totalMarks === 50 ? 60 : Math.max(maxQuestions, 20);
        return { maxQuestions, duration };
    };

    const testStats = calculateTestStats(testForm.totalMarks, testForm.marksPerQuestion);

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold">
                        Test Management 📝
                    </h1>
                    <p className="text-secondary mb-0">
                        Create tests, add questions, and publish for students.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Admin Dashboard
                    </button>
                </div>
            </div>

            {/* View Toggle */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="btn-group w-100" role="group">
                        <button
                            className={`btn ${viewMode === "tests" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => {
                                setViewMode("tests");
                                setSelectedTest(null);
                            }}
                        >
                            📋 All Tests
                        </button>
                        {selectedTest && (
                            <button
                                className={`btn ${viewMode === "questions" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setViewMode("questions")}
                            >
                                ❓ Questions
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tests View */}
            {viewMode === "tests" && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 className="fw-bold mb-1">Tests</h3>
                            <p className="text-secondary small mb-0">Manage your tests and question banks</p>
                        </div>
                        <button
                            className="btn btn-success shadow-sm"
                            onClick={() => setShowTestModal(true)}
                        >
                            <span className="me-1">+</span> Create Test
                        </button>
                    </div>

                    {tests.length === 0 ? (
                        <div className="card shadow-sm border-0">
                            <div className="card-body text-center py-5">
                                <div className="mb-3">
                                    <span style={{ fontSize: "3rem" }}>📝</span>
                                </div>
                                <h4 className="text-secondary">No tests created yet</h4>
                                <p className="text-secondary">Click "Create Test" to get started</p>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {tests.map((test) => (
                                <div className="col-md-6 col-lg-4 mb-4" key={test.id}>
                                    <div className="card shadow-sm h-100 border-0 hover-shadow transition-all">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="card-title fw-bold mb-2">{test.title}</h5>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <span className="badge bg-primary rounded-pill">
                                                            {testCategories.find(({ value }) => value === test.category)?.label || "Aptitude"}
                                                        </span>
                                                        {test.isPublished ? (
                                                            <span className="badge bg-success rounded-pill">Published</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark rounded-pill">Draft</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="card-text text-secondary small mb-3" style={{ minHeight: "40px" }}>
                                                {test.description || "No description"}
                                            </p>
                                            <div className="bg-light rounded p-3 mb-3">
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">📅 Deadline</div>
                                                        <div className="fw-semibold small">{formatDate(test.deadline)}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">⏱️ Duration</div>
                                                        <div className="fw-semibold small">{test.durationMinutes} mins</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">📊 Total Marks</div>
                                                        <div className="fw-semibold small">{test.totalMarks}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">❓ Questions</div>
                                                        <div className="fw-semibold small text-primary">{test.questionCount || 0}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">📝 Marks/Question</div>
                                                        <div className="fw-semibold small">{test.marksPerQuestion || 1}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="small text-muted mb-1">🎯 Max Questions</div>
                                                        <div className="fw-semibold small">{test.totalMarks / (test.marksPerQuestion || 1)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button
                                                    className="btn btn-sm btn-primary flex-grow-1"
                                                    onClick={() => fetchQuestionsByTest(test.id)}
                                                >
                                                    {test.isPublished ? "View Questions" : "Manage Questions"}
                                                </button>
                                                {!test.isPublished && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handlePublishTest(test.id)}
                                                    >
                                                        Publish
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleEditTest(test)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteTest(test.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Questions View */}
            {viewMode === "questions" && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h3 className="fw-bold">
                                {tests.find((test) => test.id === selectedTest)?.title || "Test"} Questions
                            </h3>
                            <p className="text-secondary mb-2">
                                New questions automatically use this test’s category.
                            </p>
                            <button
                                className="btn btn-sm btn-outline-secondary mb-2"
                                onClick={() => {
                                    setViewMode("tests");
                                    setSelectedTest(null);
                                    setReusableQuestions([]);
                                }}
                            >
                                ← Back to Tests
                            </button>
                        </div>
                        <div>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={(e) => setExcelFile(e.target.files[0])}
                                style={{ display: "none" }}
                                id="excelUpload"
                            />
                            <label
                                htmlFor="excelUpload"
                                className="btn btn-success btn-sm mb-2"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "📊 Import from Excel"}
                            </label>
                            {excelFile && (
                                <button
                                    className="btn btn-primary btn-sm mb-2"
                                    onClick={handleExcelUpload}
                                    disabled={uploading}
                                >
                                    Upload
                                </button>
                            )}
                        </div>
                    </div>

                    {selectedTestIsPublished && (
                        <div className="alert alert-info d-flex align-items-center gap-2" role="status">
                            <span aria-hidden="true">🔒</span>
                            <span>
                                This test is published. Its questions are locked and can no longer be added, edited, reused, or deleted.
                            </span>
                        </div>
                    )}

                    {!selectedTestIsPublished && (
                    <section className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                <div>
                                    <span className="badge bg-primary-subtle text-primary mb-2">
                                        {selectedTestCategoryLabel.toUpperCase()}
                                    </span>
                                    <h4 className="fw-bold mb-1">Reuse questions</h4>
                                    <p className="text-secondary mb-0">
                                        Select questions from other {selectedTestCategoryLabel.toLowerCase()} tests.
                                        Copies are added here; originals stay unchanged.
                                    </p>
                                </div>
                                <span className="badge rounded-pill bg-light text-dark border">
                                    {reusableQuestions.length} available
                                </span>
                            </div>

                            {reuseError && (
                                <div className="alert alert-danger py-2" role="alert">
                                    {reuseError}
                                </div>
                            )}

                            {isLoadingReusable ? (
                                <div className="text-center text-secondary py-3">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    Loading questions...
                                </div>
                            ) : reusableQuestions.length === 0 ? (
                                <div className="rounded-3 bg-light text-center text-secondary p-4">
                                    No questions from other tests in this category are available yet.
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                                        <span className="small text-secondary">
                                            {selectedReusableQuestionIds.length} selected
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-decoration-none"
                                            onClick={() => setSelectedReusableQuestionIds(
                                                selectedReusableQuestionIds.length === reusableQuestions.length
                                                    ? []
                                                    : reusableQuestions.map((question) => question.id)
                                            )}
                                            disabled={isCopyingQuestions}
                                        >
                                            {selectedReusableQuestionIds.length === reusableQuestions.length
                                                ? "Clear selection"
                                                : "Select all"}
                                        </button>
                                    </div>
                                    <div className="row g-3">
                                        {reusableQuestions.map((question) => (
                                            <div className="col-lg-6" key={question.id}>
                                                <label
                                                    className={`h-100 rounded-3 border p-3 d-flex gap-3 align-items-start ${
                                                        selectedReusableQuestionIds.includes(question.id)
                                                            ? "border-primary bg-primary-subtle"
                                                            : ""
                                                    }`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <input
                                                        className="form-check-input mt-1 flex-shrink-0"
                                                        type="checkbox"
                                                        checked={selectedReusableQuestionIds.includes(question.id)}
                                                        onChange={(event) => setSelectedReusableQuestionIds(
                                                            event.target.checked
                                                                ? [...selectedReusableQuestionIds, question.id]
                                                                : selectedReusableQuestionIds.filter((id) => id !== question.id)
                                                        )}
                                                        disabled={isCopyingQuestions}
                                                        aria-label={`Select question: ${question.questionText}`}
                                                    />
                                                    <span className="flex-grow-1">
                                                        <span className="d-flex justify-content-between align-items-start gap-2">
                                                            <span className="fw-semibold mb-2">
                                                                {question.questionText}
                                                            </span>
                                                            <span className="badge bg-light text-secondary border flex-shrink-0">
                                                                {question.marks ?? 1} mark{question.marks === 1 ? "" : "s"}
                                                            </span>
                                                        </span>
                                                        <span className="d-block small text-secondary">
                                                            {[question.optionA, question.optionB, question.optionC, question.optionD]
                                                                .filter(Boolean)
                                                                .join(" · ")}
                                                        </span>
                                                        <span className="d-block small text-primary mt-2">
                                                            From: {question.test?.title || "Another test"}
                                                        </span>
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary px-4"
                                            disabled={selectedReusableQuestionIds.length === 0 || isCopyingQuestions}
                                            onClick={handleReuseQuestions}
                                        >
                                            {isCopyingQuestions
                                                ? "Adding selected questions..."
                                                : `Add ${selectedReusableQuestionIds.length || ""} selected question${selectedReusableQuestionIds.length === 1 ? "" : "s"}`}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                    )}

                    {/* Add Question Form */}
                    {!selectedTestIsPublished && (
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-4">
                            <span className="badge bg-success-subtle text-success mb-2">
                                {editingId ? "EDIT QUESTION" : "NEW QUESTION"}
                            </span>
                            <h4 className="fw-bold mb-4">
                                {editingId ? "Update question" : "Create a question"}
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Question</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="question"
                                        value={form.question}
                                        onChange={handleChange}
                                        placeholder="Write a clear question..."
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Option 1</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="option1"
                                            value={form.option1}
                                            onChange={handleChange}
                                            placeholder="First answer choice"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Option 2</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="option2"
                                            value={form.option2}
                                            onChange={handleChange}
                                            placeholder="Second answer choice"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Option 3</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="option3"
                                            value={form.option3}
                                            onChange={handleChange}
                                            placeholder="Third answer choice"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Option 4</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="option4"
                                            value={form.option4}
                                            onChange={handleChange}
                                            placeholder="Fourth answer choice"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Correct Answer</label>
                                    <select
                                        className="form-select"
                                        name="answer"
                                        value={form.answer}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select correct answer</option>
                                        <option value={form.option1}>{form.option1 || "Option 1"}</option>
                                        <option value={form.option2}>{form.option2 || "Option 2"}</option>
                                        <option value={form.option3}>{form.option3 || "Option 3"}</option>
                                        <option value={form.option4}>{form.option4 || "Option 4"}</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Marks</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="marks"
                                        value={form.marks}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                    {selectedTest && (
                                        <small className="text-muted">
                                            Test marks per question: {tests.find((t) => t.id === selectedTest)?.marksPerQuestion || 1}
                                        </small>
                                    )}
                                    {!selectedTest && (
                                        <small className="text-muted">Points awarded for this question</small>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary px-4 me-2">
                                    {editingId ? "Update Question" : "Add Question"}
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
                    )}

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
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4 mb-2">
                                    <select
                                        className="form-select"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        <option value="Aptitude">Aptitude</option>
                                        <option value="Coding">Coding</option>
                                        <option value="Interview">Interview</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Questions Table */}
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
                                                <td colSpan="5" className="text-center py-5 text-secondary">
                                                    No questions found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredQuestions.map((question, index) => (
                                                <tr key={question.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <strong>{question.question}</strong>
                                                        <div className="small text-secondary mt-1">
                                                            {question.options.join(" | ")}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                question.category === "Aptitude"
                                                                    ? "badge bg-primary"
                                                                    : question.category === "Coding"
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
                                                        {selectedTestIsPublished ? (
                                                            <span className="text-secondary small">Published · locked</span>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => handleEdit(question)}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(question.id)}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Test Modal */}
            {showTestModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingTestId ? "Edit Test" : "Create New Test"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeTestModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleTestSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={testForm.title}
                                            onChange={handleTestChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="description"
                                            value={testForm.description}
                                            onChange={handleTestChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Category</label>
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={testForm.category}
                                            onChange={handleTestChange}
                                            required
                                        >
                                            {testCategories.map(({ value, label }) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Deadline</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="deadline"
                                            value={testForm.deadline}
                                            onChange={handleTestChange}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Total Marks</label>
                                            <select
                                                className="form-select"
                                                name="totalMarks"
                                                value={testForm.totalMarks}
                                                onChange={handleTestChange}
                                                required
                                            >
                                                <option value={20}>20 Marks</option>
                                                <option value={50}>50 Marks</option>
                                                <option value={100}>100 Marks</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Marks Per Question</label>
                                            <select
                                                className="form-select"
                                                name="marksPerQuestion"
                                                value={testForm.marksPerQuestion}
                                                onChange={handleTestChange}
                                                required
                                            >
                                                <option value={1}>1 Mark</option>
                                                <option value={2}>2 Marks</option>
                                                <option value={4}>4 Marks</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="alert alert-info">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <strong>Max Questions:</strong> {testStats.maxQuestions}
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Duration:</strong> {testStats.duration} minutes
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Formula:</strong> {testForm.totalMarks} ÷ {testForm.marksPerQuestion} = {testStats.maxQuestions} questions
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label fw-semibold">Duration (minutes)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="durationMinutes"
                                                value={testForm.durationMinutes}
                                                onChange={handleTestChange}
                                                required
                                                readOnly
                                            />
                                            <small className="text-muted">Auto-calculated based on question count (1 min per question, minimum 20 minutes)</small>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeTestModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            {editingTestId ? "Update Test" : "Create Test"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminQuestions;
