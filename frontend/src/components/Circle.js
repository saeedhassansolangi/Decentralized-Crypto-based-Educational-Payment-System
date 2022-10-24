import React from "react";
import { FaCircle } from "react-icons/fa";

function Circle({ color = "gold", text, size = 15 }) {
  return (
    <div className="list">
      <FaCircle color={color} size={size} />
      <span>{text}</span>
    </div>
  );
}

export default Circle;
