import React, { useState } from "react";
import { Centered } from "../components/styled/Centered";
import { BitcoinChart } from "./containers/Chart";
import { BitcoinNews } from "./containers/News";

function App() {
  const [display, setDisplay] = useState<"charts" | "news">("news");
  return (
    <div>
      <select
        style={{
          position: "absolute",
          left: 10,
          top: 10,
        }}
        value={display}
        onChange={(e) => {
          e.preventDefault();
          setDisplay(e.target.value as "news" | "charts");
        }}>
        <option value='news'>News</option>
        <option value='charts'>Charts</option>
      </select>
      <BitcoinChart display={display === "charts"} />
      <BitcoinNews display={display === "news"} />
    </div>
  );
}

export default () => (
  <Centered>
    <App />
  </Centered>
);
