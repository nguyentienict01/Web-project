import { useState } from "react";
import Image from "./Image";

export default function ImageMagnifier({photo}) {
    const [position, setPosition] = useState({x: 0, y: 0});
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
        setCursorPosition({ x: e.pageX - left, y: e.pageY - top });

        console.log(position);
      };
    
      return (
        <div
          className="img-magnifier-container"
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
        >
          <Image className="magnifier-img w-full object-cover rounded-md" src={photo} alt="" />
      
          {showMagnifier && (
            <div
              style={{
                position: "absolute",
                left: `${cursorPosition.x - 100}px`,
                top: `${cursorPosition.y - 100}px`,
                pointerEvents: "none",
              }}
            >
              <div
                className="magnifier-image"
                style={{
                  backgroundImage: `url(http://localhost:4000/uploads/${photo})`,
                  backgroundPosition: `${position.x}% ${position.y}%`,
                }}
              />
            </div>
          )}
        </div>
      );
}