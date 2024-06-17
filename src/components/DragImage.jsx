import React from "react";
import CanvasComponent from "./Canvas";

const DragImage = ({ shapes, setShapes }) => {
  return (
    <div className="ml-[250px]">
      <CanvasComponent shapes={shapes} setShapes={setShapes} />
    </div>
  );
};

export default DragImage;
