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

function App() {
  const [nextId, setNextId] = useState(1);
  //creates new
  const [newTodo, setNewTodo] = useState("");
  //heldur utan um arrays of Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  function handleSubmit() {
    if (!newTodo.trim()) return;
    setTodos((old) => [
      ...old,
      {
        // id: `${nextId}`,
        id: crypto.randomUUID(),
        text: newTodo,
      },
    ]);
    // setNextId((n) => n + 1);

    setNewTodo("");
  }

  return (
    <>
      <h1>Hér mun koma listi</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          placeholder="hvað þarf að gera"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
        />
        {/* the arrow function ensures that handleSubmit is only ran on a buttonclick, not render */}
        <button type="submit">Enter</button>
      </form>

      <List>
        {todos.map((todo) => (
          <Item key={todo.id} todo={todo} />
        ))}
      </List>
    </>
  );
}

export default App;
