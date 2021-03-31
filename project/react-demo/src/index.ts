import { bootstrap } from './core';
import { bootstrap as viewBootstrap } from './main';

bootstrap().then(() => {
  viewBootstrap();
});
