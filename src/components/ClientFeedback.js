import React, { useState, useEffect, useRef } from 'react';

export default function FeedbackSection() {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  const feedbacks = [
    {
      name: 'Rahul Patil',
      time: '7 months ago',
      stars: '★★★★☆',
      title: '"Life Changing!"',
      text: "I consulted Sandesh from Believe Consultancy for my daughter's Career Counseling...",
      avatar: '/images/avatar1.png',
    },
    {
      name: "Reema D'souza",
      time: '3 weeks ago',
      stars: '★★★★☆',
      title: '"Life-Changing Impact"',
      text: 'His motivational speech made me really crazy...',
      avatar: '/images/avatar2.png',
    },
    {
      name: 'Sagun Naik',
      time: '2 months ago',
      stars: '★★★★☆',
      title: '"Remarkable Transformation"',
      text: 'I was very depressed and now I’m able to identify my purpose...',
      avatar: '/images/avatar3.png',
    },
    {
      name: 'Meera Sharma',
      time: '1 month ago',
      stars: '★★★★★',
      title: '"Truly Helpful"',
      text: 'Changed my view about mental well-being...',
      avatar: '/images/avatar4.png',
    },
    {
      name: 'Aditya Jain',
      time: '2 weeks ago',
      stars: '★★★★★',
      title: '"Amazing Support"',
      text: 'Stress management workshop. Powerful and practical.',
      avatar: '/images/avatar5.png',
    },
    {
      name: 'Priya Mehta',
      time: '4 months ago',
      stars: '★★★★★',
      title: '"Very Effective"',
      text: 'Highly recommend their career sessions.',
      avatar: '/images/avatar6.png',
    },
  ];

  const slideGroups = [feedbacks.slice(0, 3), feedbacks.slice(3, 6)];

  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="fw-bold">OUR CLIENT FEEDBACK</h2>
        <div className="section-divider mx-auto mb-3"></div>
        <p className="text-muted mb-4">
          Our clients praise our counseling and consulting for providing clarity,
          actionable solutions, and transformative growth.
        </p>

        <div className="overflow-hidden position-relative">
          <div
            ref={carouselRef}
            className="d-flex transition-all"
            style={{
              width: '200%',
              transition: 'transform 0.8s ease-in-out',
            }}
          >
            {slideGroups.map((group, idx) => (
              <div
                key={idx}
                className="d-flex justify-content-center gap-3 w-100 px-2"
              >
                {group.map((f, i) => (
                  <div
                    key={i}
                    className="card shadow-sm rounded-4 p-3 bg-white"
                    style={{ width: '30%' }}
                  >
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div className="text-start">
                        <strong>{f.name}</strong>
                        <div className="text-muted small">{f.time}</div>
                      </div>
                    </div>
                    <div className="mb-1">{f.stars}</div>
                    <h6 className="fw-bold">{f.title}</h6>
                    <p className="small">{f.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
