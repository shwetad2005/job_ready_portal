import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyCourses() {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => {
        api.get("/courses/mine").then((response) => setPurchases(response.data))
            .catch(() => setError("Could not load your courses. Please try again."));
    }, []);
    return (
        <main className="container py-5">
            <h1 className="fw-bold">My courses</h1>
            <p className="text-secondary">Courses you have added to your account.</p>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {!error && purchases.length === 0 ? <div className="card border-0 shadow-sm"><div className="card-body text-center py-5"><p className="text-secondary">You have not purchased any courses yet.</p><Link className="btn btn-primary" to="/courses">Browse courses</Link></div></div> : (
                <div className="row g-3">{purchases.map(({ id, course, purchasedAt }) => <div className="col-md-6 col-lg-4" key={id}><article className="card h-100 border-0 shadow-sm"><div className="card-body"><h2 className="h5 fw-bold">{course.title}</h2><p className="text-secondary">{course.description}</p><strong>₹{Number(course.price).toFixed(2)}</strong><div className="small text-secondary mt-2">Added {new Date(purchasedAt).toLocaleDateString()}</div></div></article></div>)}</div>
            )}
        </main>
    );
}

export default MyCourses;
