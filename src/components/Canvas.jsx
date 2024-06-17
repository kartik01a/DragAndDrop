import React, { useRef, useEffect, useState } from "react";

const CanvasComponent = ({ shapes, setShapes }) => {
  const canvasRef = useRef(null);
  const [draggingShape, setDraggingShape] = useState(null);
  const [images, setImages] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawShapes(ctx);
  }, [shapes, images]);

  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };

    Promise.all([
      loadImage("/assets/connector.svg"),
      loadImage("/assets/img1.svg"),
      loadImage("/assets/img2.svg"),
      loadImage("/assets/BG.svg"), 
    ])
      .then(([connector, img1, img2, bg]) => {
        setImages({
          connector,
          img1,
          img2,
          bg, // Set background image
        });
      })
      .catch((error) => console.error("Error loading images:", error));
  }, []);

  const drawShapes = (ctx) => {
    if (images.bg) {
      ctx.drawImage(images.bg, 0, 0, canvasRef.current.width, canvasRef.current.height);
    } else {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    shapes.forEach((shape) => {
      const defaultWidth = 150;
      const defaultHeight = 150;
      const width = defaultWidth;
      const height =defaultHeight;

      if (shape.type === "img1" && images.img1) {
        ctx.drawImage(images.img1, shape.x, shape.y, width, height);
        drawMeasurements(ctx, shape, width, height);
      } else if (shape.type === "img2" && images.img2) {
        ctx.drawImage(images.img2, shape.x, shape.y, width, height);
        drawMeasurements(ctx, shape, width, height);
      }
    });

    drawConnectors(ctx);
  };

  const drawMeasurements = (ctx, shape, width, height) => {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`(${width}x${height})`, shape.x, shape.y - 5);
  };

  const drawConnectors = (ctx) => {
    shapes.forEach((shape, index) => {
      shapes.slice(index + 1).forEach((otherShape) => {
        if (isClose(shape, otherShape)) {
          drawConnector(ctx, shape, otherShape);
        }
      });
    });
  };

  const isClose = (shape1, shape2) => {
    const distance = 20; // Adjust this value as needed
    const closeX =
      Math.abs(shape1.x - (shape2.x + shape2.width)) <= distance ||
      Math.abs(shape2.x - (shape1.x + shape1.width)) <= distance;
    const closeY =
      Math.abs(shape1.y - (shape2.y + shape2.height)) <= distance ||
      Math.abs(shape2.y - (shape1.y + shape1.height)) <= distance;
    return closeX && closeY;
  };

  const drawConnector = (ctx, shape1, shape2) => {
    const x1 = shape1.x + shape1.width / 2;
    const y1 = shape1.y + shape1.height / 2;
    const x2 = shape2.x + shape2.width / 2;
    const y2 = shape2.y + shape2.height / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    const imgX = (x1 + x2) / 2 - 10;
    const imgY = (y1 + y2) / 2 - 10;
    if (images.connector) {
      ctx.drawImage(images.connector, imgX, imgY, 20, 20);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const shape = shapes.find(
      (shape) =>
        mouseX >= shape.x &&
        mouseX <= shape.x + shape.width &&
        mouseY >= shape.y &&
        mouseY <= shape.y + shape.height
    );

    if (shape) {
      setDraggingShape({
        id: shape.id,
        offsetX: mouseX - shape.x,
        offsetY: mouseY - shape.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingShape) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === draggingShape.id
          ? {
              ...shape,
              x: mouseX - draggingShape.offsetX,
              y: mouseY - draggingShape.offsetY,
            }
          : shape
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingShape(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={940}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={canvasStyle}
    />
  );
};

const canvasStyle = {
  border: "1px solid #ccc",
  display: "block",
  backgroundColor: "#fff",
};

export default CanvasComponent;
