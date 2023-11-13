import { forwardRef, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import C from '../components/hoc';
import useTheme, { themeContext } from './useTheme';

const Home = (props, ref) => {
  const { theme, changeTheme } = useContext(themeContext);
  return (
    <div
      ref={ref}
      onClick={() => {
        changeTheme('black');
      }}
    >
      {theme}
    </div>
  );
};
const RefHome = C(Home);
const Child = (props) => {
  function getChild() {
    return 132;
  }
  console.log('useTheme', useTheme);
  const { theme, changeTheme } = useTheme();
  // const { devId } = useParams();
  // const [searchParamsm, setSearchParamsm] = useSearchParams();
  // console.log('searchParamsm', searchParamsm.get('id'));
  return (
    <>
      {/* {devId}dddd
      <a
        onClick={() => {
          setSearchParamsm({
            id: 1231111,
          });
        }}
      >
        123
      </a> */}
      <themeContext.Provider
        value={{
          theme,
          changeTheme,
        }}
      >
        123
        <RefHome
          state={true}
          ref={(value) => {
            console.log('ref', value);
          }}
        ></RefHome>
      </themeContext.Provider>
    </>
  );
};
export default Child;
