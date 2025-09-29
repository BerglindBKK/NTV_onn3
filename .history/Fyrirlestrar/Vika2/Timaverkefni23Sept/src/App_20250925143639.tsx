import { useState } from "react";

import "./App.css";

type Todo = {
  id: string;
  text: string;
};

function App() {
  const [newtodo, setNewTodo] = useState("");

  return (
    <>
      <h1>Hér mun koma listi</h1>

      <input
        type="text"
        placeholder="hvað þarf að gera"
        value={newtodo}
        onChange={(event) => {
          setNewTodo(event.target.value);
        }}
      ></input>
      <button>Enter</button>
    </>
  );
}

export default App;
