import "./App.css";
import DragImage from "./components/DragImage";
import Header from "./components/Header";
import Right from "./components/Right";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <>
      <Header />

      <Sidebar />
      <DragImage />
      <Right />
    </>
  );
};

export default App;
