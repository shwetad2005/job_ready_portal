import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [owned, setOwned] = useState(new Set());
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);
    const loggedIn = Boolean(sessionStorage.getItem("authToken"));

    useEffect(() => {
        let active = true;
        Promise.all([
            api.get("/courses"),
            loggedIn ? api.get("/courses/mine") : Promise.resolve({ data: [] }),
        ]).then(([catalog, mine]) => {
            if (!active) return;
            setCourses(catalog.data);
            setOwned(new Set(mine.data.map((purchase) => purchase.course.id)));
        }).catch(() => {
            if (active) setError("Could not load the course catalog. Please try again.");
        });
        return () => { active = false; };
    }, [loggedIn]);

    const purchase = async (course) => {
        if (!loggedIn) {
            navigate("/login", { state: { redirectTo: "/courses" } });
            return;
        }
        if (!window.confirm(`Purchase “${course.title}” for ₹${Number(course.price).toFixed(2)}?\n\nDemo purchase: no payment will be charged.`)) return;
        setBusyId(course.id);
        setError("");
        try {
            await api.post(`/courses/${course.id}/purchase`);
            setOwned((previous) => new Set([...previous, course.id]));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Purchase could not be completed. Please try again.");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <main className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div><h1 className="fw-bold">Courses</h1><p className="text-secondary mb-0">Explore courses created by our team.</p></div>
                {loggedIn && <Link to="/my-courses" className="btn btn-outline-primary">My courses</Link>}
            </div>
            <div className="alert alert-info">Demo checkout: courses are added to your account without a payment charge. Online payment is not connected yet.</div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {courses.length === 0 ? <div className="card border-0 shadow-sm"><div className="card-body text-center py-5"><h2 className="h5">No courses available yet</h2><p className="text-secondary mb-0">New courses will appear here when an admin adds them.</p></div></div> : (
                <div className="row g-4">{courses.map((course) => (
                    <div className="col-md-6 col-lg-4" key={course.id}>
                        <article className="card h-100 shadow-sm border-0"><div className="card-body d-flex flex-column p-4">
                            <h2 className="h5 fw-bold">{course.title}</h2>
                            <p className="text-secondary flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>{course.description}</p>
                            <div className="d-flex justify-content-between align-items-center mt-3"><strong className="fs-5">₹{Number(course.price).toFixed(2)}</strong>
                                {owned.has(course.id) ? <span className="badge text-bg-success">Added to your courses</span> : <button className="btn btn-primary" disabled={busyId === course.id} onClick={() => purchase(course)}>{busyId === course.id ? "Processing..." : "Purchase"}</button>}
                            </div>
                        </div></article>
                    </div>
                ))}</div>
            )}
        </main>
    );
}

export default Courses;
