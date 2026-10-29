import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyCourses() {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    useEffect(() => {
        api.get("/courses/mine").then((response) => setPurchases(response.data))
            .catch(() => setError("Could not load your courses. Please try again."));
    }, []);

    const removeCourse = async (course) => {
        if (!window.confirm(`Remove “${course.title}” from your courses? Your learning progress and unlocked tests for this course will be reset.`)) return;
        setError("");
        setRemovingId(course.id);
        try {
            await api.delete(`/courses/${course.id}/enrollment`);
            setPurchases((current) => current.filter((purchase) => purchase.course.id !== course.id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not remove this course. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };
    return (
        <main className="container py-5">
            <h1 className="fw-bold">My courses</h1>
            <p className="text-secondary">Courses you have added to your account.</p>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {!error && purchases.length === 0 ? <div className="card border-0 shadow-sm"><div className="card-body text-center py-5"><p className="text-secondary">You have not purchased any courses yet.</p><Link className="btn btn-primary" to="/courses">Browse courses</Link></div></div> : (
                <div className="row g-3">{purchases.map(({ id, course, purchasedAt, learningCompleted }) => <div className="col-md-6 col-lg-4" key={id}><article className="card h-100 border-0 shadow-sm"><div className="card-body d-flex flex-column"><h2 className="h5 fw-bold">{course.title}</h2><p className="text-secondary">{course.description}</p><div className="mb-3"><span className={`badge ${learningCompleted ? "text-bg-success" : "text-bg-secondary"}`}>{learningCompleted ? "Learning complete" : "Ready to learn"}</span></div><div className="small text-secondary mb-3">Added {new Date(purchasedAt).toLocaleDateString()}</div><Link className="btn btn-primary" to={`/courses/${course.id}/learn`}>{learningCompleted ? "Continue to tests" : "Start learning"}</Link><button className="btn btn-outline-danger mt-2" disabled={removingId === course.id} onClick={() => removeCourse(course)}>{removingId === course.id ? "Removing..." : "Remove course"}</button></div></article></div>)}</div>
            )}
        </main>
    );
}

export default MyCourses;
