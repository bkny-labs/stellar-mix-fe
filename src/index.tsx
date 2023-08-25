import MainController from './controller/main-controller';
import { store } from './model/store';
import reportWebVitals from './reportWebVitals';

const mainController = new MainController(store);
mainController.init();

reportWebVitals();