"use client";
import { useEffect, useState } from "react";

const statisticsData = [
  {
    left: "Enhance your knowledge",
    right: "Expand your learning",
  },
  {
    left: "Achieve greater success",
    right: "Accomplish your goals",
  },
  {
    left: "Improve your health",
    right: "Strengthen your vitality",
  },
  {
    left: "Develop better parenting skills",
    right: "Become a better caregiver",
  },
  {
    left: "Increase happiness",
    right: "Improve your mood",
  },
  {
    left: "Be the best version of yourself!",
    right: "Maximize your abilities",
  },
];

export default function Statistics() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % statisticsData.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="statistics">
      <div className="container">
        <div className="statistics__grid">
          {/* TOP LEFT */}
          <div className="statistics__list statistics__list--left">
            {statisticsData.map((item, index) => (
              <div
                key={index}
                className={`statistics__heading ${
                  activeIndex === index ? "statistics__heading--active" : ""
                }`}
              >
                {item.left}
              </div>
            ))}
          </div>

          {/* TOP RIGHT (STATIC CARD) */}
          <div className="statistics__card statistics__card--top">
            <p>
              <span>93%</span> of Summarist members <b>significantly increase </b>
              reading frequency.
            </p>
            <p>
              <span>96%</span> of Summarist members <b>establish better </b>habits.
            </p>
            <p>
              <span>90%</span> have made <b>significant positive </b>change to their lives.
            </p>
          </div>

          {/* BOTTOM LEFT (STATIC CARD) */}
          <div className="statistics__card statistics__card--bottom">
            <p>
              <span>91%</span> of Summarist members <b>report feeling more productive </b>
              after incorporating the service into their daily routine. 
            </p>
            <p>
              <span>94%</span> of Summarist members have <b>noticed an improvement </b>
              in their overall comprehension and retention of information.
            </p>
            <p>
              <span>88%</span> of Summarist members <b>feel more informed </b>
              about current events and industry trends since using the platform. 
            </p>
          </div>

          {/* BOTTOM RIGHT */}
          <div className="statistics__list statistics__list--right">
            {statisticsData.map((item, index) => (
              <div
                key={index}
                className={`statistics__heading ${
                  activeIndex === index ? "statistics__heading--active" : ""
                }`}
              >
                {item.right}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}