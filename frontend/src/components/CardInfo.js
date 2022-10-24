import React from "react";

function CardInfo({ title, name, size }) {
  return (
    <div
      className={`col-md-${size} col-sm p-3 br m-1`}
      style={{ border: "1px solid #80808080", backgroundColor: "transparent" }}
    >
      <p>{name}</p>
      <h3>{title}</h3>
    </div>
  );
}

export default CardInfo;
