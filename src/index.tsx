import MainController from './controller/main-controller';
import { store } from './store/store';
import reportWebVitals from './reportWebVitals';

const mainController = new MainController(store);
mainController.init();

reportWebVitals();