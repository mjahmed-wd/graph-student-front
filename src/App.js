import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Tabs,Tab } from "react-bootstrap";
import "./App.css";
import AddStudent from "./components/students/AddStudent";
import AddSubject from "./components/subjects/AddSubject";

function App() {
  const [key, setKey] = useState("student");

  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="dashboard" title="Dashboard">
          Dashboard Report
        </Tab>
        <Tab eventKey="student" title="Student">
          <AddStudent />
        </Tab>
        <Tab eventKey="subject" title="Subject">
          <AddSubject/>
          {/* <button onClick={() => fetchData()}>Add Data</button> */}
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
