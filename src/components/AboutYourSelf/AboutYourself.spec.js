import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { store } from '@store/configureStore';
import AboutYourSelf from './AboutYourSelf';

describe('Загрузка и отображение <AboutYourSelf />', () => {
   const container = mount(
      <Provider store={store}>
         <AboutYourSelf />
      </Provider>
   );
   it('Рендеринг компонента <AboutYourSelf /> произошел успешно', () => {
      expect(container.html()).toMatchSnapshot();
   });
});
