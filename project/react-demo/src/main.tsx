import React from 'react';
import ReactDom from 'react-dom';
import App from './views/App';

export function bootstrap() {
  // 创建DOM到页面
  ReactDom.render(<App />, document.querySelector('#root'));
}
