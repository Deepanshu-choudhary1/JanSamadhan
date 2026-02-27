import React, { useState, useEffect } from "react";
import pic1 from "../../assets/carousalPics/pic1.webp";
import pic2 from "../../assets/carousalPics/pic2.jpeg";
import pic3 from "../../assets/carousalPics/pic3.webp";

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  const songs = [
    {
      title: "cleaning",
      subtitle: "Balthazar",
      time: "2.05",
      image: pic1,
    },
    {
      title: "sanitation",
      subtitle: "Moderator",
      time: "2.05",
      image:
        pic2,
    },
    {
      title: "potholes",
      subtitle: "Otzeki",
      time: "2.05",
      image: pic3,
    },
  ];

  // Autoplay every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % songs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [songs.length]);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-xl h-[400px] flex items-center justify-center relative">
        {songs.map((song, index) => {
          const isLeft = index === (current + 1) % songs.length;
          const isRight = index === (current - 1 + songs.length) % songs.length;

          let transform = "translate-x-0 scale-100 opacity-100 z-10";
          if (isLeft) {
            transform = "translate-x-[-40%] scale-80 opacity-40 z-0";
          } else if (isRight) {
            transform = "translate-x-[40%] scale-80 opacity-40 z-0";
          }

          return (
            <div
              key={index}
              className={`absolute w-3/5 h-full cursor-pointer transition-all duration-500 ${transform}`}
              onClick={() => setCurrent(index)}
            >
              <img
                src={song.image}
                alt={song.title}
                className="w-full h-full object-cover rounded-xl shadow-lg"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
