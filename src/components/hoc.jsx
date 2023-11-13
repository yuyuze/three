import { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useRef } from 'react';

function C(Component) {
  return forwardRef(function Son(props, ref) {
    const comRef = useRef();
    Son.PropTypes = {
      state: PropTypes.bool,
    };
    useImperativeHandle(ref, () => {
      return {
        ref: comRef.current,
        goHome: () => {},
      };
    });
    const RefC = forwardRef(Component);
    return (
      <div>
        {props.state ? (
          <RefC
            // hrefRef={ref}
            ref={(refValue) => {
              comRef.current = refValue;
            }}
            {...props}
          ></RefC>
        ) : (
          <>数据未加载</>
        )}
      </div>
    );
  });
}

export default C;
