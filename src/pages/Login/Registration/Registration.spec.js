import React from 'react';
import { shallow } from 'enzyme';

import Registration from './index';

describe('Тест формы регистрации', () => {
   let wrapper;
   const registrationFunc = jest.fn();

   it('Регистрация с верными данными', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'RightLogin' } });
      name.simulate('change', { target: { name: 'name', value: 'Name' } });
      surname.simulate('change', { target: { name: 'surname', value: 'Surname' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'test@mail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: 'RightPassword123' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(true);
   });

   it('Отмена регистрации с неподтверженным паролем', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'RightLogin' } });
      name.simulate('change', { target: { name: 'name', value: 'Name' } });
      surname.simulate('change', { target: { name: 'surname', value: 'Surname' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'test@mail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: 'wrongrasswordcheck' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(false);
   });

   it('Отмена регистрации с незаполненными формами', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'RightLogin' } });
      name.simulate('change', { target: { name: 'name', value: '' } });
      surname.simulate('change', { target: { name: 'surname', value: '' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'test@mail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: 'RightPassword123' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(false);
   });

   it('Отмена регистрации с неправильно введеной почтой', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'RightLogin' } });
      name.simulate('change', { target: { name: 'name', value: 'Name' } });
      surname.simulate('change', { target: { name: 'surname', value: 'Surname' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'testmail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: 'RightPassword123' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(false);
   });

   it('Отмена регистрации с неправильно введеным логином', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'Неправильный логин' } });
      name.simulate('change', { target: { name: 'name', value: 'Name' } });
      surname.simulate('change', { target: { name: 'surname', value: 'Surname' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'test@mail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: 'RightPassword123' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(false);
   });

   it('Отмена регистрации при отсутсвии подтверждения пароля', () => {
      wrapper = shallow(<Registration registrationFunc={registrationFunc} />);
      let login = wrapper.find({ name: 'Login' });
      let name = wrapper.find({ name: 'Name' });
      let surname = wrapper.find({ name: 'Surname' });
      let password = wrapper.find({ name: 'Password' });
      let passwordCheck = wrapper.find({ name: 'PasswordCheck' });
      let email = wrapper.find({ name: 'Email' });
      const instance = wrapper.instance();
      login.simulate('change', { target: { name: 'login', value: 'Неправильный логин' } });
      name.simulate('change', { target: { name: 'name', value: 'Name' } });
      surname.simulate('change', { target: { name: 'surname', value: 'Surname' } });
      email.simulate('change', { target: { name: 'emailReg', value: 'test@mail.ru' } });
      password.simulate('change', { target: { name: 'passwordReg', value: 'RightPassword123' } });
      passwordCheck.simulate('change', {
         target: { name: 'passwordRegCheck', value: '' }
      });
      wrapper.find('form').simulate('submit');
      expect(wrapper.state('isValid')).toBe(false);
   });
});
