import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { TTodo } from '../types/todo.ts'

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    
  const addTodo = (text: string) => {
    const newTodo: TTodo = { id: Date.now(), text };
    setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
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
    <TodoContext.Provider
      value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  ); 
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  // 컨텍스트가 없는 경우 
  if (!context) {
    throw new Error(
      "useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다."
    );
  }

  // 컨텍스트가 있는 경우 
  return context;
};