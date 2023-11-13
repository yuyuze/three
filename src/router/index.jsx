import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import App from '../App';
import Child from '../views/index';

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<App></App>}></Route>)
);
export default router;
