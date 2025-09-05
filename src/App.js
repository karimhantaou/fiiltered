import React from "react";
import './style/App.css';
import P5ImageViewer from "./components/P5ImageViewer";


function App() {
  return (
    <div className="App">

        <header>
            <img src="../assets/icon/crowbar2.png" id="crowbar"/>
            <p>FIILTERED</p>
        </header>

        <P5ImageViewer/>
    </div>
  );
}

export default App;
