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
    const loadImage = (src, width, height) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.width = width;   // set the desired width
        img.height = height; // set the desired height
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };
    
    // In your useEffect for loading images:
    Promise.all([
      loadImage("/assets/connector.svg"),
      loadImage("/assets/img1.svg", 100, 150),
      loadImage("/assets/img2.svg", 50, 50), // Load img2 with 50x50 size
      loadImage("/assets/BG.svg"),
    ])
    .then(([connector, img1, img2, bg]) => {
      setImages({
        connector,
        img1,
        img2,
        bg,
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

    drawConnectors(ctx);

    shapes.forEach((shape) => {
      if (shape.type === "img1" && images.img1) {
        drawImage(ctx, images.img1, shape);
      } else if (shape.type === "img2" && images.img2) {
        drawImage(ctx, images.img2, shape);
      }
      drawMeasurements(ctx, shape, 100, 150);
    });
  };

  const drawImage = (ctx, image, shape) => {
    if (shape.type === "img1") {
      ctx.drawImage(image, shape.x, shape.y, 100, 150);
    
    } else if (shape.type === "img2") {
      ctx.drawImage(image, shape.x, shape.y, 100, 150);
    
    }
  };

  const drawMeasurements = (ctx, shape, width, height) => {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`(${width}x${height})`, shape.x, shape.y - 5);
  };

  const drawConnectors = (ctx) => {
    shapes.forEach((shape, index) => {
      shapes.slice(index + 1).forEach((otherShape) => {
        if (shape.type === otherShape.type) {
          const { closeX, closeY } = isClose(shape, otherShape);
          if (closeX || closeY) {
            drawConnector(ctx, shape, otherShape, closeX, closeY);
          }
        }
      });
    });
  };

  const isClose = (shape1, shape2) => {
    const distance = 1; // Adjust this value as needed

    const closeX =
      shape1.y === shape2.y &&
      (Math.abs(shape1.x - (shape2.x + 100)) <= distance ||
        Math.abs(shape2.x - (shape1.x + 100)) <= distance);

    const closeY =
      shape1.x === shape2.x &&
      (Math.abs(shape1.y - (shape2.y + 150)) <= distance ||
        Math.abs(shape2.y - (shape1.y + 150)) <= distance);

    return { closeX, closeY };
  };

  const drawConnector = (ctx, shape1, shape2, closeX, closeY) => {
    console.log(shape1.type, shape2.type)
    const x1 = shape1.x + 50;
    const y1 = shape1.y + 75;
    const x2 = shape2.x + 50;
    const y2 = shape2.y + 75;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "black";
    ctx.stroke();

    const imgX = (x1 + x2) / 2 - 10;
    const imgY = (y1 + y2) / 2 - 10;


    if (images.connector && shape1.type === "img1") {
      if (closeX) {
        // Draw 5 images horizontally
        
        ctx.drawImage(images.connector, imgX, imgY - 58, 20, 20);
        ctx.drawImage(images.connector, imgX, imgY - 28, 20, 20);
        ctx.drawImage(images.connector, imgX, imgY, 20, 20);
        ctx.drawImage(images.connector, imgX, imgY + 28, 20, 20);
        ctx.drawImage(images.connector, imgX, imgY + 58, 20, 20);
      } else if (closeY) {
        // Draw 3 images vertically
        ctx.drawImage(images.connector, imgX - 28, imgY, 20, 20);
        ctx.drawImage(images.connector, imgX, imgY, 20, 20);
        ctx.drawImage(images.connector, imgX + 28, imgY, 20, 20);
      }
    } else if (images.connector && shape1.type === "img2") {
      if (closeX) {
        // Draw 5 orange circles horizontally
        ctx.fillStyle = '#E04B00';
        ctx.beginPath();
        ctx.arc(imgX + 10, imgY - 58, 28, 0, 4 * Math.PI); // Draw circle at the top
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(imgX + 10, imgY + 80, 28, 0, 4 * Math.PI); // Draw circle at the bottom
        ctx.fill();
    } else if (closeY) {
        // Draw 3 orange circles vertically
        ctx.fillStyle = '#E04B00';
        ctx.beginPath();
        ctx.arc(imgX - 40, imgY + 10, 28, 0, 4 * Math.PI); // Draw circle on the left
        ctx.fill();
    
        ctx.beginPath();
        ctx.arc(imgX + 55, imgY + 10, 28, 0, 4 * Math.PI); // Draw circle on the right
        ctx.fill();
    }
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
        mouseX <= shape.x + 100 &&
        mouseY >= shape.y &&
        mouseY <= shape.y + 150
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

    setShapes((prevShapes) => {
      return prevShapes.map((shape) => {
        if (shape.id === draggingShape.id) {
          const newX = mouseX - draggingShape.offsetX;
          const newY = mouseY - draggingShape.offsetY;

          // Check for snapping
          let snapX = newX;
          let snapY = newY;

          prevShapes.forEach((otherShape) => {
            if (otherShape.id !== shape.id && otherShape.type === shape.type) {
              const horizontalSnap =
                Math.abs(newX - otherShape.x) <= 20 ||
                Math.abs(newX + 100 - otherShape.x) <= 20 ||
                Math.abs(newX - otherShape.x - 100) <= 20;
              const verticalSnap =
                Math.abs(newY - otherShape.y) <= 20 ||
                Math.abs(newY + 150 - otherShape.y) <= 20 ||
                Math.abs(newY - otherShape.y - 150) <= 20;

              if (horizontalSnap && Math.abs(newY - otherShape.y) < 75) {
                snapX = newX < otherShape.x ? otherShape.x - 100 : otherShape.x + 100;
                snapY = otherShape.y; // Align vertically
              } else if (verticalSnap && Math.abs(newX - otherShape.x) < 50) {
                snapY = newY < otherShape.y ? otherShape.y - 150 : otherShape.y + 150;
                snapX = otherShape.x; // Align horizontally
              }
            }
          });

          return {
            ...shape,
            x: snapX,
            y: snapY,
          };
        }
        return shape;
      });
    });
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
