import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import courseSubjects from "../data/courseSubtopics";

function Courses() {
    const navigate = useNavigate();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [owned, setOwned] = useState(new Set());
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);
    const selectedCategory = new URLSearchParams(location.search).get("category") || "ALL";
    const selectedSubtopic = new URLSearchParams(location.search).get("subtopic") || "ALL";
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
        if (!window.confirm(`Enroll in “${course.title}” for free?`)) return;
        setBusyId(course.id);
        setError("");
        try {
            await api.post(`/courses/${course.id}/enroll`);
            setOwned((previous) => new Set([...previous, course.id]));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Enrollment could not be completed. Please try again.");
        } finally {
            setBusyId(null);
        }
    };

    const removeEnrollment = async (course) => {
        if (!window.confirm(`Remove “${course.title}” from your courses? Your learning progress and test access will be reset.`)) return;
        setBusyId(course.id);
        setError("");
        try {
            await api.delete(`/courses/${course.id}/enrollment`);
            setOwned((previous) => {
                const next = new Set(previous);
                next.delete(course.id);
                return next;
            });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not remove this enrollment. Please try again.");
        } finally {
            setBusyId(null);
        }
    };

    const getCourseSubtopic = (course, subject) => course.subtopic || subject.subtopics[0].value;

    const renderCourseCard = (course, subject, subtopic) => (
        <div className="col-md-6 col-lg-4" key={course.id}>
            <article className="card h-100 shadow-sm border-0"><div className="card-body d-flex flex-column p-4">
                <span className="badge text-bg-primary align-self-start mb-2">{subject.label}</span>
                <h3 className="h5 fw-bold">{course.title}</h3>
                <p className="small text-primary fw-semibold">{subtopic.label}</p>
                <p className="text-secondary flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>{course.description}</p>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3"><strong className="fs-5 text-success">Free</strong>
                    {owned.has(course.id) ? <div className="d-flex flex-wrap gap-2"><Link className="btn btn-outline-primary" to={`/courses/${course.id}/learn`}>Start learning</Link><button className="btn btn-outline-danger" disabled={busyId === course.id} onClick={() => removeEnrollment(course)}>{busyId === course.id ? "Removing..." : "Remove enrollment"}</button></div> : <button className="btn btn-primary" disabled={busyId === course.id} onClick={() => purchase(course)}>{busyId === course.id ? "Enrolling..." : "Enroll for free"}</button>}
                </div>
            </div></article>
        </div>
    );

    const visibleSubjects = courseSubjects.filter((subject) => selectedCategory === "ALL" || subject.value === selectedCategory);

    return (
        <main className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div><h1 className="fw-bold">Courses</h1><p className="text-secondary mb-0">Explore courses created by our team.</p></div>
                {loggedIn && <Link to="/my-courses" className="btn btn-outline-primary">My courses</Link>}
            </div>
            <div className="row g-3 mb-4">
                <div className="col-md-5">
                <label className="form-label" htmlFor="course-category-filter">Subject</label>
                <select id="course-category-filter" className="form-select" value={selectedCategory} onChange={(event) => navigate(event.target.value === "ALL" ? "/courses" : `/courses?category=${event.target.value}`)}>
                    <option value="ALL">All subjects</option>
                    {courseSubjects.map((subject) => <option key={subject.value} value={subject.value}>{subject.label}</option>)}
                </select>
                </div>
            </div>
            <div className="alert alert-info">All courses are free. Enroll to access the lessons and unlock the subject tests after learning.</div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {visibleSubjects.map((subject) => (
                <section className="mb-5" key={subject.value} aria-labelledby={`subject-${subject.value}`}>
                    <h2 id={`subject-${subject.value}`} className="fw-bold border-bottom pb-2">{subject.label}</h2>
                    {subject.subtopics.filter((subtopic) => selectedSubtopic === "ALL" || subtopic.value === selectedSubtopic).map((subtopic) => {
                        const topicCourses = courses.filter((course) => course.category === subject.value && getCourseSubtopic(course, subject) === subtopic.value);
                        return (
                            <div className="mt-4" key={subtopic.value}>
                                <h3 className="h5 fw-semibold">{subtopic.label}</h3>
                                {topicCourses.length === 0 ? <p className="small text-secondary">No courses added yet.</p> : <div className="row g-3">{topicCourses.map((course) => renderCourseCard(course, subject, subtopic))}</div>}
                            </div>
                        );
                    })}
                </section>
            ))}
        </main>
    );
}

export default Courses;
