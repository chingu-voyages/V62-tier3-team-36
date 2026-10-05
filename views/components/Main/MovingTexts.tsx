import React from "react";
import Marquee from "react-fast-marquee";

const MovingTextList = () => {
  const texts = [
    "⚡ Instant CSV Data Upload & Cleaning", 
    "📊 Automated Sales & Revenue Tracking", 
    "💡 Unlock Hidden Margins in Your Sales Data", 
    "🛠️ Simple, Fast, and Powerful Retail Analytics"
  ];

  return (
    <div className="text-gray-500 font-bold p-15 pl-20 h-[250px] flex items-center  justify0center">
      <Marquee 
        speed={60}            // Speed in pixels per second (default is 50)
        pauseOnHover={true}   // Pauses the moving text when a user hovers over it
        autoFill={true}      // Automatically duplicates items to fill the empty screen space
      >
        {texts.map((text, index) => (
          <span className="px-8" key={index} >
            {text}
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default MovingTextList;