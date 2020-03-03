import React, { useState, useEffect } from 'react';
import Form from '@components/Form';
import TodoList from '@components/TodoList';
import { ITodo } from '@interfaces/todos';

declare var confirm: (qusetion: string) => boolean;

const Main: React.FC = () => {
   const [todos, setTodos] = useState<ITodo[]>([]);

   useEffect(() => {
      const saved = JSON.parse(localStorage.getItem('todos') || '[]') as ITodo[];
      setTodos(saved);
   }, []);
   useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
   }, [todos]);

   const addHandler = (title: string): void => {
      const newTodo: ITodo = {
         title: title,
         id: Date.now(),
         completed: false
      };
      setTodos((prev) => [newTodo, ...prev]);
   };

   const toggleHandler = (id: number) => {
      setTodos((prev) =>
         prev.map((todo) => {
            if (todo.id === id) todo.completed = !todo.completed;
            return todo;
         })
      );
   };

   const removeHandler = (id: number) => {
      const shouldRemove = confirm('Вы точно хотите удалить это дело?');
      if (shouldRemove) setTodos((prev) => prev.filter((todo) => todo.id !== id));
   };

   return (
      <>
         <div className="container mt-3">
            <h1>Главная страница</h1>
            <Form onAdd={addHandler} />
            <TodoList todos={todos} onToggle={toggleHandler} onRemove={removeHandler} />
         </div>

      </>
   );
};

export default Main;
