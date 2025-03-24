import { FormEvent, useState } from "react";
import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
  const [input, setInput] = useState<string>('');
  const { addTodo } = useTodo();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //버튼 클릭 시 새로고침 방지
    console.log('동작함')
    const text = input.trim(); //공백 자름
  
    if (text) {
      addTodo(text);
      setInput('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="todo-container__form">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type='text'
        className="todo-container__input"
        placeholder="할 일 입력"
        required
      />
      <button type='submit' className="todo-container__button">
        할 일 추가
      </button>
    </form>
  );
};

export default TodoForm;