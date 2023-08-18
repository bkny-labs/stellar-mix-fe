import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './model/store';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
<Provider store={store}>
  <App />
</Provider>);

