import React, { useRef } from 'react';
import { Input } from 'antd';
import styles from './styles.module.scss';

interface FormProps {
   onAdd(title: string): void;
}

const Form: React.FC<FormProps> = (props) => {
   // const [title, setTitle] = useState<string>('');
   // const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
   //    setTitle(event.target.value);
   // };

   const ref = useRef<Input>(null);
   const keyPressHandler = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
         props.onAdd(ref.current!.input.value);
         ref.current!.setValue('');
      }
   };
   return (
      <div className={styles['form-container']}>
         <Input
            placeholder="Введите название дела"
            type={'text'}
            id={'title'}
            ref={ref}
            onKeyPress={keyPressHandler}
            // value={title}
            // onChange={changeHandler}
         />
      </div>
   );
};

export default Form;
