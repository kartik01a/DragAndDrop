import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { FaReact } from "react-icons/fa";

const DragImage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const iconSize = 50; // Size of the icon
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 1024 1024">${
      FaReact().props.children
    }</svg>`;
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {image && (
          <KonvaImage
            image={image}
            x={position.x}
            y={position.y}
            draggable
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDragEnd={(e) => {
              setIsDragging(false);
              setPosition({
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            stroke={isDragging ? "green" : "black"}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default DragImage;
