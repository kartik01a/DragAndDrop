import React from "react";
import { TbArrowBackUp, TbArrowForwardUp } from "react-icons/tb";
import { PiCube } from "react-icons/pi";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { BsArrowsFullscreen } from "react-icons/bs";

const Header = () => {
  return (
    <header className="text-gray-600 body-font border-b-2 z-[1000]">
      <div className="container mx-auto flex flex-wrap py-4 px-2 flex-col md:flex-row justify-between items-center">
        <div className="flex pl-2 w-1/2">
          <div className="flex px-4">
            <div className="flex flex-col items-center px-2">
              <TbArrowBackUp className="text-2xl " />
              <span className="flex flex-col items-center px-2">Undo</span>
            </div>
            <div>
              <TbArrowForwardUp className="text-2xl " />
              <span>Redo</span>
            </div>
          </div>
          <button className="rounded border border-slate-400 hover:bg-gray-200 px-2">
            Start Over
          </button>
        </div>
        <div className="flex pl-2 w-1/2 ">
          <div className="flex px-4 w-1/2 ml-auto justify-around">
            <div className="flex flex-col items-center px-2">
              <CiZoomIn className="text-2xl " />
              <span className="flex flex-col items-center px-2">Zoom In</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <BsArrowsFullscreen className="text-2xl " />
              <span>Center</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <CiZoomOut className="text-2xl " />
              <span>Zoom Out</span>
            </div>
            <div className="flex flex-col items-center px-2">
              <PiCube className="text-2xl " />
              <span>3D</span>
            </div>
          </div>
          <button className="rounded border border-slate-400 hover:bg-gray-200 px-2 text-black mx-4">
            Parts Breakdown
          </button>
          <button className="rounded border border-slate-400 bg-sky-600 hover:bg-sky-300 px-2 text-white mx-4">
            Request Quotes
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
