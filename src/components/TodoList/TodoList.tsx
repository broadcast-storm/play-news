import React from 'react';
import { Checkbox, Icon, List } from 'antd';
import styles from './styles.module.scss';
import { ITodo } from '@interfaces/todos';

type TodoListProps = {
   todos: ITodo[];
   onToggle: (id: number) => void;
   onRemove: (id: number) => void;
};
const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onRemove }) => {
   const onRemoveHandler = (event: React.MouseEvent, id: number) => {
      event.preventDefault();
      onRemove(id);
   };

   return (
      <>
         <List
            itemLayout="horizontal"
            dataSource={todos}
            renderItem={(todo) => {
               let classTodo: string = '';
               if (todo.completed) {
                  classTodo = 'completed';
               }
               return (
                  <List.Item className={styles['item']}>
                     <Checkbox onChange={onToggle.bind(null, todo.id)} checked={todo.completed}>
                        <span className={styles[classTodo]}>{todo.title}</span>
                     </Checkbox>
                     <Icon
                        type="delete"
                        theme="filled"
                        className={'text-danger'}
                        onClick={(event) => onRemoveHandler(event, todo.id)}
                     />
                  </List.Item>
               );
            }}
         />
      </>
   );
};

export default TodoList;
