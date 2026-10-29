import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import PublishedCategoryTest from "../Quiz/PublishedCategoryTest";
import courseSubjects from "../data/courseSubtopics";

const categoryNames = {
    APTITUDE: "Aptitude",
    CODING: "Coding",
    INTERVIEW_PREPARATION: "Interview Preparation",
};

function getYouTubeVideoId(value) {
    if (!value) return null;
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();
        if (host === "youtu.be" || host === "www.youtu.be") {
            return url.pathname.split("/").filter(Boolean)[0] || null;
        }
        if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) return null;
        if (url.pathname === "/watch") return url.searchParams.get("v");
        const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
        return match?.[1] || null;
    } catch {
        return null;
    }
}

function LearnCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState("");
    const [isCompleting, setIsCompleting] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const subtopicName = courseSubjects.flatMap((subject) => subject.subtopics)
        .find((subtopic) => subtopic.value === course?.subtopic)?.label;
    const videoId = getYouTubeVideoId(course?.youtubeUrl);

    const loadCourse = async () => {
        try {
            const response = await api.get(`/courses/${courseId}/learn`);
            setCourse(response.data);
        } catch (requestError) {
            if (requestError.response?.status === 404) {
                setError("This course is not in your account. Browse courses and add it first.");
            } else {
                setError("Could not load the learning material. Please try again.");
            }
        }
    };

    useEffect(() => { loadCourse(); }, [courseId]);

    useEffect(() => {
        let active = true;
        let objectUrl = "";
        setFileUrl("");
        if (course?.learningFileName) {
            api.get(`/courses/${courseId}/material`, { responseType: "blob" })
                .then((response) => {
                    objectUrl = URL.createObjectURL(response.data);
                    if (active) setFileUrl(objectUrl);
                    else URL.revokeObjectURL(objectUrl);
                })
                .catch(() => { if (active) setError("Could not load the uploaded material file."); });
        }
        return () => {
            active = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [course?.learningFileName, courseId]);

    const finishLearning = async () => {
        setIsCompleting(true);
        setError("");
        try {
            await api.post(`/courses/${courseId}/complete`);
            await loadCourse();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not unlock the test. Please try again.");
        } finally {
            setIsCompleting(false);
        }
    };

    const removeEnrollment = async () => {
        if (!window.confirm(`Remove “${course.title}” from your courses? Your learning progress and test access will be reset.`)) return;
        try {
            await api.delete(`/courses/${courseId}/enrollment`);
            navigate("/my-courses", { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Could not remove this course. Please try again.");
        }
    };

    if (error && !course) {
        return <main className="container py-5"><div className="alert alert-warning">{error}</div><Link className="btn btn-primary" to="/courses">Browse courses</Link></main>;
    }
    if (!course) return <main className="container py-5 text-center"><div className="spinner-border" role="status" /><p className="mt-3">Loading course...</p></main>;

    return (
        <main className="container py-5">
            <div className="mb-4 d-flex justify-content-between align-items-center gap-3"><Link to="/my-courses" className="text-decoration-none">← My courses</Link><button className="btn btn-outline-danger btn-sm" onClick={removeEnrollment}>Remove course</button></div>
            <section className="card border-0 shadow-sm mb-4"><div className="card-body p-4 p-md-5">
                <span className="badge text-bg-primary mb-2">{categoryNames[course.category] || "Learning path"}</span>
                <h1 className="fw-bold">{course.title}</h1>
                {subtopicName && <p className="fw-semibold text-primary">{subtopicName}</p>}
                <p className="lead text-secondary">{course.description}</p>
                <hr />
                <h2 className="h4 fw-bold">Study material</h2>
                <div className="learning-content" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{course.learningContent}</div>
                {videoId && <section className="mt-4" aria-label="YouTube lesson"><h3 className="h5 fw-bold">Video lesson</h3><div className="ratio ratio-16x9"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`${course.title} video lesson`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></section>}
                {course.learningFileName && <div className="mt-4"><h3 className="h5 fw-bold">Course file: {course.learningFileName}</h3>{fileUrl ? (/\.pdf$/i.test(course.learningFileName) ? <iframe className="w-100 border rounded" src={fileUrl} title={`${course.title} PDF material`} style={{ height: "75vh" }} /> : <a className="btn btn-outline-primary" href={fileUrl} download={course.learningFileName}>Download course material</a>) : <span className="small text-secondary">Loading file...</span>}</div>}
                {!course.learningCompleted && <div className="mt-4"><p className="text-secondary">Study the material, then mark it complete to unlock the related {categoryNames[course.category]} tests.</p><button className="btn btn-success" disabled={isCompleting} onClick={finishLearning}>{isCompleting ? "Unlocking tests..." : "I finished learning — show tests"}</button></div>}
            </div></section>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {course.learningCompleted && <section aria-labelledby="course-tests-title"><div className="alert alert-success" role="status">Learning complete. Your related tests are unlocked below.</div><h2 id="course-tests-title" className="visually-hidden">Related course tests</h2><PublishedCategoryTest category={course.category} /></section>}
        </main>
    );
}

export default LearnCourse;
