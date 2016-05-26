import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

const setReduxState = (setState, dispatch, props) => {
  if (typeof setState.value === 'function') {
    setState.value = setState.value(props);
    console.log(props);
  }
  return (a, b) => b
    ? dispatch(setStateByPath(`${setState.value}.${a}`, b))
    : dispatch(setStateByPath(setState.value, a));
};

const replaceReduxState = (setState, dispatch, props) => {
  if (typeof setState.value === 'function') {
    setState.value = setState.value(props);
  }
  return (a, b) => b
    ? dispatch(replaceStateByPath(`${setState.value}.${a}`, b))
    : dispatch(replaceStateByPath(setState.value, a));
};

export default function reducelessConnect(path, dispatchProps = {}, setState, replaceState) {
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
      dispatch => bindActionCreators({
        dispatch,
        ...dispatchProps,
      }, dispatch),
      (state, actions, props) => {
        const { dispatch } = actions;
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

        props = {
          ...slicedState,
          ...props,
        }

        if (setState) {
          // setState is object
          if (typeof setState === 'object' && Object.prototype.toString.call(setState) !== '[object Array]') {
            setState = getKeyAndValueFromObject(setState);

            setStateProps = {
              [setState.key]: setReduxState(setState, dispatch, props),
            };
          }

          // setState is array
          if (typeof setState === 'object' && Object.prototype.toString.call(setState) === '[object Array]') {
            setState.map(item => {
              const setStateData = getKeyAndValueFromObject(item);

              setStateProps = {
                ...setStateProps,
                [setStateData.key]: setReduxState(setStateData, dispatch, props),
              };
            });
          }
        }

        if (replaceState) {
          // replaceState is object
          if (typeof replaceState === 'object' && Object.prototype.toString.call(replaceState) !== '[object Array]') {
            replaceState = getKeyAndValueFromObject(replaceState);

            replaceStateProps = {
              [replaceState.key]: replaceReduxState(replaceState, dispatch),
            };
          }

          // replaceState is array
          if (typeof replaceState === 'object' && Object.prototype.toString.call(replaceState) === '[object Array]') {
            replaceState.map(item => {
              const replaceStateData = getKeyAndValueFromObject(item);

              replaceStateProps = {
                ...replaceStateProps,
                [replaceStateData.key]: replaceReduxState(replaceStateData, dispatch),
              };
            });
          }
        }

        return {
          ...props,
          ...actions,
          ...setStateProps,
          ...replaceStateProps,
        };
      }
    )(Connect);
  };
}
