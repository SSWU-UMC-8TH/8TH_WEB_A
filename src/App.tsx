import React, { useState } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
}

const App = () => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

  const handleAdd = () => {
    if (input.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const handleDone = (id: number) => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;

    setTodos(todos.filter((todo) => todo.id !== id));
    setDoneTodos([...doneTodos, target]);
  };

  const handleDelete = (id: number) => {
    setDoneTodos(doneTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">YONG TODO</h1>

      <div className="todo-container__form">
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="todo-container__button" onClick={handleAdd}>
          할 일 추가
        </button>
      </div>

      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button"
                  onClick={() => handleDone(todo.id)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 목록 */}
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button"
                  onClick={() => handleDelete(todo.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
