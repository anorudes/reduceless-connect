# Reduceless-connect

Simple abstraction over Redux to make state management easy. <br />
You can change redux state for ui without creating constants and actions, just see examples.

Based on [reduceless](https://github.com/nosovsh/reduceless)

## Basic example:

For start we will create simple reducer file as you doing with redux. <br />
You already know how to do it:

```js
const initialState = {
  settings: {
    showExamplePopup: false,
  }
}
export default function app(state, action) { }
```
After this we can use new "connect" from "reduceless-connect":<br />
This example for change "test" variable in reducer "app" without constants and actions. Simple?

```js
import { connect } from 'reduceless-connect';
import * as actionCreators from 'redux/modules'; // https://github.com/erikras/ducks-modular-redux

@connect(
  ['app'], // working as 'state => state.app' in @connect react-redux.
  { ...actionCreators.app }, // working as 'dispatch => bindActionCreators({ ...actionCreators.app }, dispatch)' in @connect react-redux
  // why did me add "actionsCreators"? Just for example, we can replace default "connect" in "redux" with "connect" from reduceless-connect.

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

    return (
      <section>
        <button onClick={() => setAppSettings({ showExamplePopup: true })}>
          test
        </button>
        { settings.showExamplePopup && <div>showExamplePopup === true</div> }
      </section>
    );
  }
}
```
Don't forget: We have actionCreators too. So we can use redux actions for data fetch and new method "setAppSettings" for change ui

## Multiple selector and setReduxState example:

With this example we can change "settings" in "categories" reducer and "settings" in app reducer without constants and actions.

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

Can i change array? Yes, can! See next example for more details:

```js
<button onClick={() => setAppSettings('list.2', { qwe: true })}> // = app.settings.list[2].qwe = true
```

For object:

```js
<button onClick={() => setAppSettings('example.a', { qwe: true })}> // = app.settings.example.a.qwe = true
```

## Full example in "redux-easy-boilerplate":

See the repo "redux-easy-boilerplate", branch "[reduceless-connect](https://github.com/anorudes/redux-easy-boilerplate/tree/reduceless-connect)".<br />
Component "[app/components/Containers/ReducelessExample](https://github.com/anorudes/redux-easy-boilerplate/blob/reduceless-connect/app/components/Containers/ReducelessExample/index.js)"

## Also you can:
## Deep selector example

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

## How it intall?

Very simple. Just install npm package

```
$ npm install reduceless-connect --save-dev
```

After: you need update your default code with redux.<br />
Jus add "wrapReducerWithSetGlobalState" in combine reducers:

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

And your simple reducer file:

```js
export default function app(state = {
  settings: {
    test: false,
  },
}, action) {
```
