# Reduceless-connect
Simple abstraction over Redux to make state management easy. <br />
Based on [reduceless](https://github.com/nosovsh/reduceless)

## Example:

```js
import { connect } from 'reduceless-connect';
import * as actionCreators from 'redux/modules'; // https://github.com/erikras/ducks-modular-redux

@connect(
  ['app'], // working as 'state => state.app' in @connect react-redux
  { ...actionCreators.app }, // working as 'dispatch => bindActionCreators({ ...actionCreators.app }, dispatch)' in @connect react-redux
  [{ setAppSettings: 'app.settings' }], // new method for change app.settings redux state
)
export default class TestComponent extends Component {
  static propTypes = {
    setAppSettings: PropTypes.func,
    settings: PropTypes.object,
    data: PropTypes.array,
  };
  render() {
    const { settings, setAppSettings, data } = this.props;
    console.log(data);
    return (
      <section>
        <button onClick={() => setAppSettings({ test: true })}>
          test
        </button>
        { settings.test && <div>test === true</div> }
      </section>
    );
  }
}
```

## Multiple selector and setReduxState example:

```js
@connect(
  ['app', 'user', 'categories'], // working as 'state => ({ ...state.app, ...state.user, ...state.categories })' in @connect react-redux
  { ...actionCreators.app, ...actionCreators.posts }, // // working as 'dispatch => bindActionCreators({ ...actionCreators.app, ...actionCreators.posts }, dispatch)' in @connect react-redux in @connect react-redux
  [{
    setAppSettings: 'app.settings'
  }, {
    setCategoriesSettings: 'categories.settings'
  }],
)
```

## setReduxState by path

```js
<button onClick={() => setAppSettings('example.a' { qwe: true })}> // = app.settings.example.a.qwe = true
```

```js
<button onClick={() => setAppSettings('list.2' { qwe: true })}> // = app.settings.list[2].qwe = true
```

## Deep selector example:

```js
@connect(
  ['app.data.info', 'posts.example.test'], // working as 'state => ({ ...state.app.data.info, ...state.posts.example.test })' in @connect react-redux
```

## Props in setReduxState method

```js
@connect(
  ['app'], // working as 'state => state.app' in @connect react-redux
  { ...actionCreators.app }, // working as 'dispatch => bindActionCreators({ ...actionCreators.app }, dispatch)' in @connect react-redux
  [{ setAppSettings: props => `app.data.${props.index}` }],
)
```

## Full example:

See the repo "redux-easy-boilerplate", branch "[reduceless-connect](https://github.com/anorudes/redux-easy-boilerplate/tree/reduceless-connect)".<br />
Component "[app/components/Containers/ReducelessExample](https://github.com/anorudes/redux-easy-boilerplate/blob/reduceless-connect/app/components/Containers/ReducelessExample/index.js)"

## Install

Combine reducers:

```js
import { wrapReducerWithSetGlobalState } from 'reduceless-connect';

const rootReducer = wrapReducerWithSetGlobalState(
  combineReducers({
    form: formReducer,
    app,
    user,
    users,
    posts,
    categories,
    questions,
    rules,
    quotes,
  })
);
```

Reducer:

```js
export default function app(state = {
  data: ['just example', 'just example'],
  settings: {
    test: false,
  },
}, action) {
```