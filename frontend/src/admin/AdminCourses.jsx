import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import courseSubjects from "../data/courseSubtopics";

const categories = courseSubjects;
const emptyForm = { title: "", category: "APTITUDE", subtopic: "QUANTITATIVE_APTITUDE", description: "", learningContent: "", youtubeUrl: "" };

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [learningFile, setLearningFile] = useState(null);
    const fileInputRef = useRef(null);
    const [deletingId, setDeletingId] = useState(null);

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
        if (!form.learningContent.trim() && !learningFile) {
            setError("Add learning text or upload a course material file.");
            return;
        }
        setSaving(true);
        try {
            const courseData = new FormData();
            Object.entries(form).forEach(([key, value]) => courseData.append(key, value));
            if (learningFile) courseData.append("learningFile", learningFile);
            await api.post("/courses", courseData);
            setForm(emptyForm);
            setLearningFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setMessage("Learning course added. Add its related test and questions from Manage Questions.");
            await loadCourses();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not add course. Check the details and try again.");
        } finally {
            setSaving(false);
        }
    };

    const removeCourse = async (course) => {
        if (!window.confirm(`Remove “${course.title}”? This also removes student enrollments and the uploaded material.`)) return;
        setError("");
        setDeletingId(course.id);
        try {
            await api.delete(`/courses/${course.id}`);
            setCourses((current) => current.filter((item) => item.id !== course.id));
            setMessage(`“${course.title}” was removed.`);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not remove this course. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="container py-5">
            <h1 className="fw-bold">Manage courses</h1>
            <p className="text-secondary">Create subject learning material. Students study it first, then take published tests in the same category.</p>
            <div className="alert alert-info">After adding a learning path, use <Link to="/admin/questions">Manage Tests &amp; Questions</Link> to create a test in the same subject and publish it. The test appears after the learner completes this material.</div>
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h2 className="h4 fw-bold mb-3">Add a course</h2>
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-title">Course title</label>
                            <input id="course-title" className="form-control" maxLength="200" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-category">Subject</label>
                            <select id="course-category" className="form-select" value={form.category} onChange={(e) => {
                                const subject = categories.find((item) => item.value === e.target.value);
                                setForm({ ...form, category: e.target.value, subtopic: subject.subtopics[0].value });
                            }}>
                                {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-subtopic">Subtopic</label>
                            <select id="course-subtopic" className="form-select" value={form.subtopic} onChange={(e) => setForm({ ...form, subtopic: e.target.value })}>
                                {categories.find((item) => item.value === form.category)?.subtopics.map((subtopic) => <option key={subtopic.value} value={subtopic.value}>{subtopic.label}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-description">Short description</label>
                            <textarea id="course-description" className="form-control" rows="3" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-learning">Learning notes (optional if you upload a file)</label>
                            <textarea id="course-learning" className="form-control" rows="7" value={form.learningContent} onChange={(e) => setForm({ ...form, learningContent: e.target.value })} placeholder="Write lessons, examples, formulas, explanations, and practice tips." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-youtube">YouTube lesson URL (optional)</label>
                            <input id="course-youtube" type="url" className="form-control" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="course-file">Upload course material</label>
                            <input ref={fileInputRef} id="course-file" type="file" className="form-control" accept=".pdf,.docx,.pptx,.txt" onChange={(e) => setLearningFile(e.target.files?.[0] || null)} />
                            <div className="form-text">PDF, Word, PowerPoint, or TXT; maximum 20 MB. Students can download it in the learning page.</div>
                            {learningFile && <div className="small text-secondary mt-1">Selected: {learningFile.name}</div>}
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
                        <article className="card h-100 shadow-sm border-0"><div className="card-body d-flex flex-column">
                            <span className="badge text-bg-primary mb-2">{categories.find((item) => item.value === course.category)?.label || "Course"}</span>
                            <div className="small fw-semibold text-primary mb-2">{categories.flatMap((item) => item.subtopics).find((item) => item.value === course.subtopic)?.label || "Subtopic not set"}</div>
                            <h3 className="h5 fw-bold">{course.title}</h3>
                            <p className="text-secondary">{course.description}</p>
                            {course.learningFileName && <div className="small text-secondary mb-2">Material: {course.learningFileName}</div>}
                            {course.youtubeUrl && <div className="small text-secondary mb-2">YouTube lesson added</div>}
                            <strong className="text-success">Free</strong>
                            <button className="btn btn-outline-danger mt-3 align-self-start" disabled={deletingId === course.id} onClick={() => removeCourse(course)}>{deletingId === course.id ? "Removing..." : "Remove course"}</button>
                        </div></article>
                    </div>
                ))}</div>
            )}
        </main>
    );
}

export default AdminCourses;
