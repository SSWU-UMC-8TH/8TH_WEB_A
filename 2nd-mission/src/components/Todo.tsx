import { FormEvent, useState } from "react";
import { TTodo } from "../types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const Todo = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>('');

  console.log('Input', input)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //버튼 클릭 시 새로고침 방지
    console.log('동작함')
    const text = input.trim(); //공백 자름

    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput('');
    }
  };

  const completeTodo = (todo: TTodo) => {
    setTodos(prevTodos => prevTodos.filter((t): boolean => t.id
      !== todo.id)); // 완료 버튼을 누른 것을 제외한 나머지를 보여주기 위해 필터링
    setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]); // 완료 리스트로 옮기기
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prevDoneTodo) =>
      prevDoneTodo.filter((t) => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">TODO LIST</h1>
      <TodoForm input={input} setInput={setInput} handleSubmit={handleSubmit}/>
      <div className="render-container">
        <TodoList
          title='할 일'
          todos={todos}
          buttonLabel='완료'
          buttonColor='#28a745'
          onClick={completeTodo}
        />
        <TodoList
          title='완료'
          todos={doneTodos}
          buttonLabel='삭제'
          buttonColor='#cd3545'
          onClick={deleteTodo}
        />
      </div>
    </div>
  )
};

export default Todo;