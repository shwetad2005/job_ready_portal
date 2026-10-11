import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    // Load all registered students
    const loadUsers = () => {

        // All registered users
        let registeredUsers =
            JSON.parse(localStorage.getItem("users")) || [];

        // Old/current user
        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        /*
         If old user exists but is not present
         inside users array, add it.
        */
        if (currentUser && currentUser.email) {

            const alreadyExists =
                registeredUsers.some(
                    (user) =>
                        user.email?.toLowerCase() ===
                        currentUser.email.toLowerCase()
                );

            if (!alreadyExists) {

                registeredUsers.push({
                    id: currentUser.id || Date.now(),
                    fullName: currentUser.fullName || "",
                    email: currentUser.email,
                    password: currentUser.password || "",
                    registeredAt:
                        currentUser.registeredAt ||
                        new Date().toISOString(),
                });

                localStorage.setItem(
                    "users",
                    JSON.stringify(registeredUsers)
                );
            }
        }

        // Test results
        const results =
            JSON.parse(
                localStorage.getItem("weeklyScores")
            ) || [];

        // Prepare student data
        const studentData =
            registeredUsers.map((student) => {

                const studentResults =
                    results.filter(
                        (result) =>
                            result.email === student.email ||
                            result.name === student.fullName
                    );

                const bestScore =
                    studentResults.length > 0
                        ? Math.max(
                            ...studentResults.map(
                                (result) =>
                                    Number(result.score) || 0
                            )
                        )
                        : 0;

                return {
                    id: student.id,
                    name: student.fullName,
                    email: student.email,
                    attempts: studentResults.length,
                    bestScore: bestScore,
                };
            });

        setUsers(studentData);
    };


    // Load users when page opens
    useEffect(() => {

        loadUsers();

    }, []);


    // Delete student
    const handleDelete = (email) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmDelete) {
            return;
        }

        // Get all users
        const registeredUsers =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

        // Remove selected student
        const updatedUsers =
            registeredUsers.filter(
                (user) =>
                    user.email !== email
            );

        // Save updated users
        localStorage.setItem(
            "users",
            JSON.stringify(updatedUsers)
        );


        // Remove student's test results
        const results =
            JSON.parse(
                localStorage.getItem("weeklyScores")
            ) || [];

        const studentToDelete =
            registeredUsers.find(
                (user) =>
                    user.email === email
            );

        const updatedResults =
            results.filter(
                (result) =>
                    result.email !== email &&
                    result.name !==
                    studentToDelete?.fullName
            );

        localStorage.setItem(
            "weeklyScores",
            JSON.stringify(updatedResults)
        );


        // If deleted student is currently logged in
        const currentUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        if (
            currentUser &&
            currentUser.email === email
        ) {
            localStorage.removeItem("user");
        }


        // Refresh table
        loadUsers();

        alert(
            "Student deleted successfully."
        );
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


                <button
                    className="btn btn-dark"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* Student Count */}

            <div className="mb-3">

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

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.email
                                                            )
                                                        }
                                                    >
                                                        Delete
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

export default AdminUsers;