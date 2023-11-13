/**
 * 鉴权路由组件
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, Route } from 'react-router-dom';
const AuthRoute = (props) => {
  const [isAuth, setAuth] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate('/auth');
    }
  }, []);

  return null;
};
AuthRoute.prototype = {
  meta: PropTypes.array,
};
export default AuthRoute;
