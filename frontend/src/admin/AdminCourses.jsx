import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = { title: "", description: "", price: "" };

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const loadCourses = async () => {
        try {
            const response = await api.get("/courses");
            setCourses(response.data);
        } catch {
            setError("Could not load courses. Please try again.");
        }
    };

    useEffect(() => { loadCourses(); }, []);

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setSaving(true);
        try {
            await api.post("/courses", { ...form, price: Number(form.price) });
            setForm(emptyForm);
            setMessage("Course added to the catalog.");
            await loadCourses();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not add course. Check the details and try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="container py-5">
            <h1 className="fw-bold">Manage courses</h1>
            <p className="text-secondary">Add courses to the student catalog with a price and description.</p>
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-3">Add a course</h2>
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-title">Course title</label>
                            <input id="course-title" className="form-control" maxLength="200" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-description">Description</label>
                            <textarea id="course-description" className="form-control" rows="4" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-price">Price (₹)</label>
                            <input id="course-price" type="number" className="form-control" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                        </div>
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        {message && <div className="alert alert-success" role="status">{message}</div>}
                        <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Add course"}</button>
                    </form>
                </div>
            </div>
            <h2 className="h4 fw-bold mb-3">Catalog ({courses.length})</h2>
            {courses.length === 0 ? <p className="text-secondary">No courses have been added yet.</p> : (
                <div className="row g-3">{courses.map((course) => (
                    <div className="col-md-6 col-lg-4" key={course.id}>
                        <article className="card h-100 shadow-sm border-0"><div className="card-body">
                            <h3 className="h5 fw-bold">{course.title}</h3>
                            <p className="text-secondary">{course.description}</p>
                            <strong>₹{Number(course.price).toFixed(2)}</strong>
                        </div></article>
                    </div>
                ))}</div>
            )}
        </main>
    );
}

export default AdminCourses;
