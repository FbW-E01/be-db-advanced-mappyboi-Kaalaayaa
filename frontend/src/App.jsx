import { useState } from "react";
import React from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./main.css";
import icon from "leaflet/dist/images/marker-icon.png";
import Map from './Map.jsx'

export default function App() {
  const [position, setPosition] = useState(null);
  const [desc, setDesc] = useState(null);

  // Configure leaflet Marker icon - without this it is broken 💩
  // Wow this kind of sucks and was super hard to find!
  const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: null  });
  L.Marker.prototype.options.icon = DefaultIcon;

  console.log("BACKEND RUNNING AT " + "http://localhost:8080/");

  function report() {

    const report = {
      position: position.lat + "," + position.lng,
      description: desc,
    };
    
    const url = "http://localhost:8080/" + "notifications"
    const config = {
      method: "POST",
      body: JSON.stringify(report),
      headers: {
        "Content-Type": "application/json"
      }
    }

  fetch(url, config)
    .then( response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log("Oh noo", error))
    
  }

  return (
    <div className="form">
      <Map position={position} setPosition={setPosition} />
      <div className="form-fields">
        <h3>Report abandoned bicycle</h3>
        {position && <>GPS: {position.lat}, {position.lng}</>}
        <br />
        <textarea
          onChange={e=>setDesc(e.target.value)}
          placeholder="Write short description here"
        >{desc}</textarea>
        <button onClick={report}>Send report</button>
      </div>
    </div>
  );
}
