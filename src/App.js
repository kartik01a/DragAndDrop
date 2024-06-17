import React, { useState } from "react";
import "./App.css";
import DragImage from "./components/DragImage";
import Header from "./components/Header";
import Right from "./components/Right";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [shapes, setShapes] = useState([]);

  const addShape = (type) => {
    setShapes((prevShapes) => [
      ...prevShapes,
      {
        id: prevShapes.length + 1,
        type,
        x: Math.random() * 500,
        y: Math.random() * 400,
        width: 200,
        height: 200,
      },
    ]);
  };

  return (
    <>
      <Header setShapes={setShapes} />
      <Sidebar addShape={addShape} />
      <DragImage shapes={shapes} setShapes={setShapes} />
      <Right addShape={addShape} />
    </>
  );
};

export default App;
