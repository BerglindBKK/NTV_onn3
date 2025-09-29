import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hér mun koma listi</h1>

      <input type="text" placeholder="hvað þarf að gera"></input>
    </>
  );
}

export default App;
