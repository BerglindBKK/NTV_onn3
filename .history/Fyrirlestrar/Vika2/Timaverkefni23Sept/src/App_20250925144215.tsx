import { useState, type ReactNode } from "react";

import "./App.css";

type Todo = {
  id: string;
  text: string;
};

type ListProps = {
  children: ReactNode;
};

function List(props: ListProps) {
  return <ul>{props.children}</ul>;
}

function Item(props: ItemProps) {
  <li></li>;
}

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
