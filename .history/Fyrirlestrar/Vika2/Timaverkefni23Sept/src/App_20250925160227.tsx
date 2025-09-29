import { useState, type ReactNode } from "react";

import "./App.css";

type ListProps = {
  children: ReactNode;
};

type Todo = {
  id: string;
  text: string;
};

type ItemProps = {
  todo: Todo;
};

function List(props: ListProps) {
  return <ul>{props.children}</ul>;
}

function Item(props: ItemProps) {
  return <li>{props.todo.text}</li>;
}

let nextId = 1;

function App() {
  //creates new
  const [newTodo, setNewTodo] = useState("");
  //heldur utan um arrays of Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  function handleSubmit() {
    if (!newTodo.trim()) return;
    setTodos((old) => [
      ...old,
      {
        id: `${nextId}`,
        text: newTodo,
      },
      nextId++;
    ]);
    setNewTodo("");
    
  }

  return (
    <>
      <h1>Hér mun koma listi</h1>

      <input
        type="text"
        placeholder="hvað þarf að gera"
        value={newTodo}
        onChange={(event) => {
          setNewTodo(event.target.value);
        }}
      ></input>
      //the arrow function ensures that handle
      <button onClick={(e) => handleSubmit()}>Enter</button>

      <List>
        {todos.map((todo) => (
          <Item key={todo.id} todo={todo} />
        ))}
      </List>
    </>
  );
}

export default App;
