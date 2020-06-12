import React from 'react';
import { shallow } from 'enzyme';

import SignIn from './index';

describe('Тест формы входа в личный кабинет', () => {
   let wrapper;
   const loginFunc = jest.fn();

   it('Проверка email input', () => {
      wrapper = shallow(<SignIn />);
      wrapper
         .find('input[type="email"]')
         .simulate('change', { target: { name: 'email', value: 'test@mail.ru' } });
      expect(wrapper.state('email')).toEqual('test@mail.ru');
   });

   it('Проверка password input', () => {
      wrapper = shallow(<SignIn />);
      wrapper
         .find('input[type="password"]')
         .simulate('change', { target: { name: 'password', value: 'testpassword' } });
      expect(wrapper.state('password')).toEqual('testpassword');
   });

   it('Проверка входа с верными данными', () => {
      wrapper = shallow(<SignIn loginFunc={loginFunc} />);
      wrapper
         .find('input[type="email"]')
         .simulate('change', { target: { name: 'username', value: 'test@mail.ru' } });
      wrapper
         .find('input[type="password"]')
         .simulate('change', { target: { name: 'password', value: 'RightPassword123' } });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('logedIn')).toBe(true);
   });

   it('Проверка входа с неверным паролем', () => {
      wrapper = shallow(<SignIn loginFunc={loginFunc} />);
      wrapper
         .find('input[type="email"]')
         .simulate('change', { target: { name: 'username', value: 'test@mail.ru' } });
      wrapper
         .find('input[type="password"]')
         .simulate('change', { target: { name: 'password', value: 'wrongpassword' } });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('logedIn')).toBe(false);
   });

   it('Проверка входа с неверной почтой', () => {
      wrapper = shallow(<SignIn loginFunc={loginFunc} />);
      wrapper
         .find('input[type="email"]')
         .simulate('change', { target: { name: 'username', value: 'test@mail' } });
      wrapper
         .find('input[type="password"]')
         .simulate('change', { target: { name: 'password', value: 'RightPassword123' } });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('logedIn')).toBe(false);
   });
});
