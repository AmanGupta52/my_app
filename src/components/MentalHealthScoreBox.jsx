import React, { useState } from "react";

const questions = [
  {
    question: "How often do you feel anxious or stressed?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "Do you struggle with sleep or dreams?",
    options: ["Never", "Occasionally", "Frequently", "Always"],
  },
  {
    question: "Do you experience mood swings or irritability?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "Do you feel overwhelmed in social situations?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "Do you experience panic or sudden fear?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
  {
    question: "Do you feel depressed or sad often?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "Do you have difficulty focusing or concentrating?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
  {
    question: "Do you have trouble controlling anger?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    question: "Do you experience body aches or migraines?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
  {
    question: "Do you struggle with eating or body image issues?",
    options: ["Never", "Sometimes", "Often", "Always"],
  },
];

export default function MentalHealthAssessment() {
  const [start, setStart] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (value) => {
    setScore(score + value);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setStart(false);
    setCurrentQ(0);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div
      className="score-box bg-white p-4 rounded shadow text-center fade-in"
      style={{
        width: "400px",
        minHeight: "400px",
        maxHeight: "400px",
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      {!start ? (
        <>
          <h5 className="fw-bold">Find your Mental Health Score</h5>
          <img
            src="/images/home2.png"
            alt="Mental Score"
            width="200"
            height="200"
            className="my-3 img-fluid"
            style={{ maxHeight: "150px", objectFit: "contain", margin: "0 auto" }}
          />
          <button
            className="btn btn-warning w-100 mt-3"
            onClick={() => setStart(true)}
          >
            Start Your Assessment
          </button>
        </>
      ) : !completed ? (
        <>
          <p className="fw-bold my-3">
            {currentQ + 1}. {questions[currentQ].question}
          </p>
          {questions[currentQ].options.map((opt, idx) => (
            <button
              key={idx}
              className="btn btn-warning m-2"
              onClick={() => handleAnswer(idx + 1)}
            >
              {opt}
            </button>
          ))}
          <p className="mt-auto text-muted" style={{ fontSize: "0.9rem" }}>
            Question {currentQ + 1} of {questions.length}
          </p>
        </>
      ) : (
        <>
          <h5 className="fw-bold mb-3">Your Mental Health Score: {score}</h5>
          <div className="d-grid gap-2 mt-3">
            <a href="/book-session" className="btn btn-success w-100">
              Book a Session
            </a>
            <button className="btn btn-warning w-100" onClick={restart}>
              Take Assessment Again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
