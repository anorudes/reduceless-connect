import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import setStateByPath from './setStateByPath';
import replaceStateByPath from './replaceStateByPath';

const getKeyAndValueFromObject = obj => {
  let value;
  let key;

  for (const i in obj) {
    key = i;
    value = obj[key];
  }

  return {
    key,
    value,
  };
};

export default function reducelessConnect(path, dispatchProps, setState, replaceState) {
  return function (WrappedComponent) {
    class Connect extends React.Component {
      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }
    return connect(
      state => state,
      dispatch => ({ dispatch }),
      (state, { dispatch }, props) => {
        let slicedState = {};
        let setStateProps = {};
        let replaceStateProps = {};

        if (typeof path === 'string') {
          // path is string
          slicedState = get(state, path);
        } else if (Object.prototype.toString.call(path) === '[object Array]') {
          // path is array
          path.map(item => {
            slicedState = {
              ...slicedState,
              ...get(state, item),
            };
          });
        }

        if (setState) {
          // setState is object
          if (typeof setState === 'object' && Object.prototype.toString.call(setState) !== '[object Array]') {
            setState = getKeyAndValueFromObject(setState);

            setStateProps = {
              [setState.key]: newState => dispatch(setStateByPath(setState.value, newState)),
            };
          }

          // setState is array
          if (typeof setState === 'object' && Object.prototype.toString.call(setState) === '[object Array]') {
            setState.map(item => {
              const setStateData = getKeyAndValueFromObject(item);

              setStateProps = {
                ...setStateProps,
                [setStateData.key]: newState => dispatch(setStateByPath(setStateData.value, newState)),
              };
            });
          }
        }

        if (replaceState) {
          // replaceState is object
          if (typeof replaceState === 'object' && Object.prototype.toString.call(replaceState) !== '[object Array]') {
            replaceState = getKeyAndValueFromObject(replaceState);

            replaceStateProps = {
              [replaceState.key]: newState => dispatch(replaceStateByPath(replaceState.value, newState)),
            };
          }

          // replaceState is array
          if (typeof replaceState === 'object' && Object.prototype.toString.call(replaceState) === '[object Array]') {
            replaceState.map(item => {
              const replaceStateData = getKeyAndValueFromObject(item);

              replaceStateProps = {
                ...replaceStateProps,
                [replaceStateData.key]: newState => dispatch(replaceStateByPath(replaceStateData.value, newState)),
              };
            });
          }
        }

        return {
          ...props,
          ...slicedState,
          ...dispatchProps,
          ...setStateProps,
          ...replaceStateProps,
        };
      }
    )(Connect);
  };
}
