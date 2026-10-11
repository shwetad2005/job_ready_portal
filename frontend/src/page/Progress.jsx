function Progress() {
  const progressData = [
    {
      title: "Aptitude",
      icon: "🧠",
      score: 75,
      total: 100,
      completed: 15,
      questions: 20
    },
    {
      title: "Coding",
      icon: "💻",
      score: 80,
      total: 100,
      completed: 16,
      questions: 20
    },
    {
      title: "Interview Preparation",
      icon: "👔",
      score: 70,
      total: 100,
      completed: 14,
      questions: 20
    }
  ];

  // Calculate overall progress
  const overallProgress = Math.round(
    progressData.reduce((sum, item) => sum + item.score, 0) /
      progressData.length
  );

  // Calculate total completed questions
  const totalCompleted = progressData.reduce(
    (sum, item) => sum + item.completed,
    0
  );

  // Calculate total questions
  const totalQuestions = progressData.reduce(
    (sum, item) => sum + item.questions,
    0
  );

  return (
    <div className="container mt-5 mb-5">

      {/* Page Heading */}
      <div className="text-center">

        <h2 className="fw-bold">
          Progress Tracking 📊
        </h2>

        <p className="text-muted mt-2">
          Track your placement preparation and monitor your progress.
        </p>

      </div>

      {/* Overall Progress */}
      <div className="card shadow-sm border-0 mt-4 p-4">

        <div className="row align-items-center">

          <div className="col-md-4 text-center">

            <h5 className="text-muted">
              Overall Progress
            </h5>

            <h1 className="fw-bold mt-2">
              {overallProgress}%
            </h1>

            <p className="text-muted mb-0">
              Keep going! 🚀
            </p>

          </div>

          <div className="col-md-8">

            <h6 className="mb-2">
              Your overall preparation
            </h6>

            <div
              className="progress"
              style={{ height: "25px" }}
            >

              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${overallProgress}%` }}
              >
                {overallProgress}%
              </div>

            </div>

            <p className="text-muted mt-2 mb-0">
              Continue practicing to improve your score.
            </p>

          </div>

        </div>

      </div>

      {/* Statistics */}
      <div className="row mt-4">

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-0 text-center p-3 h-100">

            <h6 className="text-muted">
              Questions Completed
            </h6>

            <h3 className="fw-bold mt-2">
              {totalCompleted}
            </h3>

          </div>

        </div>

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-0 text-center p-3 h-100">

            <h6 className="text-muted">
              Total Questions
            </h6>

            <h3 className="fw-bold mt-2">
              {totalQuestions}
            </h3>

          </div>

        </div>

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-0 text-center p-3 h-100">

            <h6 className="text-muted">
              Completion Rate
            </h6>

            <h3 className="fw-bold mt-2">
              {Math.round((totalCompleted / totalQuestions) * 100)}%
            </h3>

          </div>

        </div>

      </div>

      {/* Category Progress */}
      <h4 className="fw-bold mt-5 mb-3">
        Category Progress
      </h4>

      <div className="row">

        {progressData.map((item, index) => {

          const percentage =
            (item.score / item.total) * 100;

          return (
            <div
              className="col-md-4 mb-4"
              key={index}
            >

              <div className="card shadow-sm border-0 h-100 p-4">

                {/* Icon and title */}
                <div className="d-flex align-items-center">

                  <span
                    style={{
                      fontSize: "35px",
                      marginRight: "15px"
                    }}
                  >
                    {item.icon}
                  </span>

                  <div>

                    <h5 className="fw-bold mb-1">
                      {item.title}
                    </h5>

                    <small className="text-muted">
                      {item.completed} / {item.questions} completed
                    </small>

                  </div>

                </div>

                {/* Score */}
                <div className="d-flex justify-content-between mt-4">

                  <span className="text-muted">
                    Score
                  </span>

                  <strong>
                    {item.score}%
                  </strong>

                </div>

                {/* Progress bar */}
                <div
                  className="progress mt-2"
                  style={{ height: "12px" }}
                >

                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${percentage}%`
                    }}
                  ></div>

                </div>

                {/* Status */}
                <div className="mt-3">

                  {percentage >= 80 ? (
                    <span className="badge bg-success">
                      Excellent
                    </span>
                  ) : percentage >= 60 ? (
                    <span className="badge bg-warning text-dark">
                      Good Progress
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      Needs Practice
                    </span>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Motivation Card */}
      <div className="card shadow-sm border-0 mt-3 p-4 text-center">

        <h4 className="fw-bold">
          Keep Practicing! 🚀
        </h4>

        <p className="text-muted mt-2 mb-0">
          Consistent practice is the key to cracking your dream placement.
        </p>

        <p className="mt-2 mb-0">
          Practice Aptitude, Coding and Interview questions regularly.
        </p>

      </div>

    </div>
  );
}

export default Progress;