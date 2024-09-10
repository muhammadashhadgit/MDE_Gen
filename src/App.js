import React from "react";
import SimpleMDEEditor from "./components/SimpleMDEEditor";

const App = () => {
  return (
    <div>
      <h1 style={{ marginBottom: "50px", textAlign: "center" }}>Markdown Editor</h1>
      <SimpleMDEEditor />
    </div>
  );
};

export default App;
