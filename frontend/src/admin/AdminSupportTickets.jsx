import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

function AdminSupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [replyDrafts, setReplyDrafts] = useState({});
    const [savingReplyId, setSavingReplyId] = useState(null);

    useEffect(() => {
        api.get("/tickets")
            .then((response) => setTickets(response.data))
            .catch((error) => {
                console.error("Unable to load support tickets:", error);
                setErrorMessage("Unable to load support tickets. Please try again.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const updateStatus = async (ticketId, status) => {
        setErrorMessage("");
        try {
            const response = await api.patch(`/tickets/${ticketId}/status`, { status });
            setTickets((previous) => previous.map((ticket) => (
                ticket.id === ticketId ? response.data : ticket
            )));
        } catch (error) {
            console.error("Unable to update ticket status:", error);
            setErrorMessage("Unable to update ticket status. Please try again.");
        }
    };

    const sendReplyAndResolve = async (ticket) => {
        const adminReply = (replyDrafts[ticket.id] || "").trim();
        if (!adminReply) {
            setErrorMessage("Write a reply before resolving the ticket.");
            return;
        }
        setErrorMessage("");
        setSavingReplyId(ticket.id);
        try {
            const response = await api.patch(`/tickets/${ticket.id}/status`, {
                status: "RESOLVED",
                adminReply,
            });
            setTickets((previous) => previous.map((item) => item.id === ticket.id ? response.data : item));
            setReplyDrafts((previous) => ({ ...previous, [ticket.id]: "" }));
        } catch (error) {
            console.error("Unable to send ticket reply:", error);
            setErrorMessage(error.response?.data?.message
                || (error.response
                    ? `Unable to send the reply and resolve this ticket (server error ${error.response.status}).`
                    : "Unable to connect to the server. Please try again."));
        } finally {
            setSavingReplyId(null);
        }
    };

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h1 className="fw-bold mb-1">Exam support tickets</h1>
                    <p className="text-secondary mb-0">Review student exam complaints and queries.</p>
                </div>
                <Link className="btn btn-outline-secondary" to="/admin/dashboard">← Admin dashboard</Link>
            </div>

            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <section className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Issue</th>
                                <th>Test</th>
                                <th>Details</th>
                                <th>Submitted</th>
                                <th>Reply to student</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td className="text-center py-5" colSpan="7">Loading tickets...</td></tr>
                            ) : tickets.length === 0 ? (
                                <tr><td className="text-center py-5 text-secondary" colSpan="7">No exam support tickets have been submitted.</td></tr>
                            ) : tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>
                                        <strong>{ticket.studentName}</strong>
                                        <div className="small text-secondary">{ticket.studentEmail}</div>
                                    </td>
                                    <td>
                                        <strong>{ticket.subject}</strong>
                                        <div className="small text-secondary">{ticket.category.replaceAll("_", " ")}</div>
                                    </td>
                                    <td>{ticket.testName || "—"}</td>
                                    <td className="text-wrap" style={{ minWidth: "240px", maxWidth: "420px" }}>
                                        {ticket.description}
                                    </td>
                                    <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                    <td style={{ minWidth: "280px" }}>
                                        {ticket.adminReply && <div className="small alert alert-success py-2">Sent reply: {ticket.adminReply}</div>}
                                        <textarea
                                            className="form-control form-control-sm mb-2"
                                            rows="3"
                                            maxLength="5000"
                                            aria-label={`Reply to ${ticket.studentName} about ${ticket.subject}`}
                                            placeholder="Write a solution or reply for this student..."
                                            value={replyDrafts[ticket.id] || ""}
                                            onChange={(event) => setReplyDrafts((previous) => ({ ...previous, [ticket.id]: event.target.value }))}
                                        />
                                        <button className="btn btn-sm btn-success" disabled={savingReplyId === ticket.id} onClick={() => sendReplyAndResolve(ticket)}>
                                            {savingReplyId === ticket.id ? "Sending..." : "Send reply & resolve"}
                                        </button>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            aria-label={`Update status for ${ticket.subject}`}
                                            value={ticket.status}
                                            onChange={(event) => updateStatus(ticket.id, event.target.value)}
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.replaceAll("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                        {ticket.status !== "RESOLVED" ? (
                                            <button
                                                className="btn btn-sm btn-outline-success mt-2 w-100"
                                                onClick={() => updateStatus(ticket.id, "RESOLVED")}
                                            >
                                                Close ticket
                                            </button>
                                        ) : (
                                            <span className="small text-success d-block text-center mt-2">Ticket closed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default AdminSupportTickets;
