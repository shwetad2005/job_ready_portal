import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ticketCategories = [
    { value: "EXAM_ISSUE", label: "Exam issue" },
    { value: "RESULT_QUERY", label: "Result query" },
    { value: "TECHNICAL_ISSUE", label: "Technical issue" },
    { value: "OTHER", label: "Other exam-related query" },
];

const statusLabels = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
};

function StudentResults() {
    const [results, setResults] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [form, setForm] = useState({
        testId: "",
        category: "EXAM_ISSUE",
        subject: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const attemptedTests = useMemo(() => {
        const tests = new Map();
        results.forEach((result) => {
            if (result.testId) {
                tests.set(result.testId, result.testName);
            }
        });
        return [...tests.entries()];
    }, [results]);

    useEffect(() => {
        const loadStudentData = async () => {
            try {
                const [attemptsResponse, ticketsResponse] = await Promise.all([
                    api.get("/attempts/mine"),
                    api.get("/tickets/mine"),
                ]);
                setResults(attemptsResponse.data);
                setTickets(ticketsResponse.data);
            } catch (error) {
                console.error("Unable to load student results or tickets:", error);
                setErrorMessage("Unable to load your results and support requests. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadStudentData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            const response = await api.post("/tickets", {
                ...form,
                testId: form.testId || null,
            });
            setTickets((previous) => [response.data, ...previous]);
            setForm({
                testId: "",
                category: "EXAM_ISSUE",
                subject: "",
                description: "",
            });
            setSuccessMessage("Your exam support ticket has been submitted.");
        } catch (error) {
            console.error("Unable to submit support ticket:", error);
            setErrorMessage(
                error.response?.data?.message
                    || "Unable to submit your ticket right now. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h1 className="fw-bold mb-1">My results & exam support</h1>
                    <p className="text-secondary mb-0">
                        Review your published test scores or contact the team about an exam.
                    </p>
                </div>
                <Link className="btn btn-outline-secondary" to="/dashboard">
                    ← Dashboard
                </Link>
            </div>

            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success" role="status">{successMessage}</div>}

            <section className="card shadow-sm border-0 mb-5" aria-labelledby="results-heading">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-3" id="results-heading">Test results</h2>
                    {isLoading ? (
                        <p className="text-secondary mb-0">Loading your results...</p>
                    ) : results.length === 0 ? (
                        <p className="text-secondary mb-0">
                            You have not submitted any published tests yet. Your results will appear here after you finish one.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Test</th>
                                        <th>Category</th>
                                        <th>Score</th>
                                        <th>Percentage</th>
                                        <th>Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result) => (
                                        <tr key={result.id}>
                                            <td className="fw-semibold">Test {result.attemptNumber || 1}: {result.testName}</td>
                                            <td>{result.category}</td>
                                            <td>{result.score} / {result.total}</td>
                                            <td>
                                                <span className="badge bg-primary">{result.percentage}%</span>
                                            </td>
                                            <td>
                                                {result.attemptedAt
                                                    ? new Date(result.attemptedAt).toLocaleString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            <section className="row g-4" id="exam-support">
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 fw-bold">Raise an exam support ticket</h2>
                            <p className="text-secondary">
                                Tell us what happened or ask a question about a test or its result.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="ticket-category">Issue type</label>
                                    <select
                                        className="form-select"
                                        id="ticket-category"
                                        value={form.category}
                                        onChange={(event) => setForm({ ...form, category: event.target.value })}
                                    >
                                        {ticketCategories.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="ticket-test">Related test (optional)</label>
                                    <select
                                        className="form-select"
                                        id="ticket-test"
                                        value={form.testId}
                                        onChange={(event) => setForm({ ...form, testId: event.target.value })}
                                    >
                                        <option value="">Not linked to a completed test</option>
                                        {attemptedTests.map(([testId, testName]) => (
                                            <option key={testId} value={testId}>{testName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="ticket-subject">Subject</label>
                                    <input
                                        className="form-control"
                                        id="ticket-subject"
                                        maxLength="150"
                                        required
                                        value={form.subject}
                                        onChange={(event) => setForm({ ...form, subject: event.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="ticket-description">Details</label>
                                    <textarea
                                        className="form-control"
                                        id="ticket-description"
                                        rows="5"
                                        maxLength="5000"
                                        required
                                        value={form.description}
                                        onChange={(event) => setForm({ ...form, description: event.target.value })}
                                    />
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit ticket"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 fw-bold mb-3">My support tickets</h2>
                            {isLoading ? (
                                <p className="text-secondary">Loading your tickets...</p>
                            ) : tickets.length === 0 ? (
                                <p className="text-secondary mb-0">Your submitted tickets will appear here.</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {tickets.map((ticket) => (
                                        <article className="border rounded p-3" key={ticket.id}>
                                            <div className="d-flex justify-content-between gap-2">
                                                <h3 className="h6 fw-bold">{ticket.subject}</h3>
                                                <span className={`badge align-self-start ${
                                                    ticket.status === "RESOLVED"
                                                        ? "bg-success"
                                                        : ticket.status === "IN_PROGRESS"
                                                            ? "bg-primary"
                                                            : "bg-secondary"
                                                }`}>
                                                    {statusLabels[ticket.status] || ticket.status}
                                                </span>
                                            </div>
                                            <p className="small text-secondary mb-1">
                                                {ticketCategories.find((category) => category.value === ticket.category)?.label}
                                                {ticket.testName ? ` · ${ticket.testName}` : ""}
                                            </p>
                                            <p className="mb-1">{ticket.description}</p>
                                            {ticket.adminReply && <div className="alert alert-success mt-3 mb-2"><strong>Admin reply:</strong><p className="mb-1 mt-1">{ticket.adminReply}</p>{ticket.adminReplyAt && <small>Replied {new Date(ticket.adminReplyAt).toLocaleString()}</small>}</div>}
                                            <small className="text-secondary">
                                                {new Date(ticket.createdAt).toLocaleString()}
                                            </small>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default StudentResults;
