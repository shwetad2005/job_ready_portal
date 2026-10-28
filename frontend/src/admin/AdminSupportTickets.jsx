import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

function AdminSupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td className="text-center py-5" colSpan="6">Loading tickets...</td></tr>
                            ) : tickets.length === 0 ? (
                                <tr><td className="text-center py-5 text-secondary" colSpan="6">No exam support tickets have been submitted.</td></tr>
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
