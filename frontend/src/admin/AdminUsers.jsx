import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    // Load all registered students from backend
    const loadUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/users/students");

            // Transform backend data to match frontend structure
            setUsers(response.data.map((student) => ({
                id: student.id,
                name: student.fullName,
                email: student.email,
                attempts: student.attempts,
                bestScore: student.bestScore,
            })));
        } catch (err) {
            setError(err.response?.status === 403
                ? "You must be signed in as an admin to view students."
                : err.response?.data?.message || err.message || "Unable to load students.");
            console.error("Error loading students:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Open create modal
    const openCreateModal = () => {
        setFormData({ fullName: "", email: "", password: "" });
        setShowCreateModal(true);
    };

    // Open edit modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.name,
            email: user.email,
            password: ""
        });
        setShowEditModal(true);
    };

    // Create new student
    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            await api.post("/users", formData);
            setShowCreateModal(false);
            loadUsers();
            alert("Student created successfully!");
        } catch (err) {
            alert("Error creating student: " + err.message);
            console.error("Error creating student:", err);
        }
    };

    // Update student
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/users/${editingUser.id}`, formData);
            setShowEditModal(false);
            loadUsers();
            alert("Student updated successfully!");
        } catch (err) {
            alert("Error updating student: " + err.message);
            console.error("Error updating student:", err);
        }
    };


    // Load users when page opens
    useEffect(() => {

        loadUsers();

    }, []);


    // Delete student
    const handleDelete = async (id, email) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/users/${id}`);

            // Refresh table
            loadUsers();

            alert(
                "Student deleted successfully."
            );
        } catch (err) {
            alert("Error deleting student: " + (err.response?.data?.message || err.message));
            console.error("Error deleting student:", err);
        }
    };

    // Close modals
    const closeModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setEditingUser(null);
    };


    return (
        <div className="container mt-5 mb-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold">
                        Manage Students 👥
                    </h1>

                    <p className="text-secondary mb-0">
                        View and manage registered students.
                    </p>

                </div>


                <div className="d-flex gap-2">
                    <button
                        className="btn btn-success"
                        onClick={openCreateModal}
                    >
                        + Add Student
                    </button>

                    <button
                        className="btn btn-dark"
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                    >
                        ← Admin Dashboard
                    </button>
                </div>

            </div>


            {/* Student Count */}

            <div className="mb-3">

                {loading && (
                    <span className="badge bg-warning text-dark fs-6 me-2">
                        Loading...
                    </span>
                )}

                {error && (
                    <span className="badge bg-danger fs-6 me-2">
                        Error: {error}
                    </span>
                )}

                <span className="badge bg-primary fs-6">
                    Total Students: {users.length}
                </span>

            </div>


            {/* Student Table */}

            <div className="card shadow">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover text-center mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>#</th>

                                    <th>
                                        Student Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Test Attempts
                                    </th>

                                    <th>
                                        Best Score
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="py-4 text-secondary"
                                        >
                                            No registered students found.
                                        </td>

                                    </tr>

                                ) : (

                                    users.map(
                                        (user, index) => (

                                            <tr
                                                key={
                                                    user.email ||
                                                    user.id
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>


                                                <td className="fw-semibold">

                                                    {user.name}

                                                </td>


                                                <td>

                                                    {user.email}

                                                </td>


                                                <td>

                                                    <span className="badge bg-info text-dark">

                                                        {user.attempts}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="badge bg-success">

                                                        {user.bestScore}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() =>
                                                                openEditModal(user)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                    user.email
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

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

            {/* Create Student Modal */}
            {showCreateModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Student</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModals}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreate}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModals}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                        >
                                            Create Student
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Student</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModals}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Password (leave blank to keep current)
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModals}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Update Student
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

export default AdminUsers;
