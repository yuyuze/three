import { useEffect, Fragment } from 'react';
import { RoomThree } from './factoryRoom/index';
import { CityThree } from './cityThree/index';
import { Route, Routes, Link, Outlet } from 'react-router-dom';
import Axios from 'axios';
import cityData from './assets/building_waiwei_all.json';
import Child from './views/index';
import './App.css';
import AuthRoute from './views/AuthRoute';
import '../src/three/6.js';
function App(props) {
  console.log('props', props);
  useEffect(() => {
    // const loader = new ObjectLoader();
    // loader.load(
    //   'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    //   (group) => {
    //     console.log('group', group);
    //   }
    // );
    // Axios({
    //   method: 'get',
    //   url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    // }).then((res) => {
    //   console.log('res', res.data);
    //   let model = new CityThree({
    //     mapData: res.data,
    //     cityData: cityData,
    //   });
    //   model.createMap();
    // });
    // let roomThree = new RoomThree();
  }, []);

  return (
    <>
      {/* 123
      <Link to={'/chi'}>跳转</Link>
      <Routes>
        <Route
          path={'/child/:devId'}
          element={
            <AuthRoute meta={['son', 'admin']}>
              <Child />
            </AuthRoute>
          }
        ></Route>

        <Route
          path={'/chi'}
          element={
            <>
              <Child />
              <Outlet />
            </>
          }
        >
          <Route path="dev" element={<>dev</>}></Route>
        </Route>
        <Route path={'/*'} element={<>noAuth</>}></Route>
      </Routes> */}
    </>
  );
}

export default App;
