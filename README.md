# Reduceless-connect
based on [reduceless](https://github.com/nosovsh/reduceless)

## Install

## Combine reducers:

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

## Reducer:

```js
export default function app(state = {
  data: ['just example', 'just example'],
  settings: {
    test: false,
  },
}, action) {
```

## Example:

```js
import { connect } from 'reduceless-connect';

@connect(
  'app', // working as 'state => state.app' in @connect react-redux
  { ...actionCreators.app }, // working as 'bindActionCreators(...actionCreators.app)' in @connect react-redux
  { setAppSettings: 'app.settings' }, // new method for change app.settings redux state
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

## Other example:

```js
import { connect } from 'reduceless-connect';

@connect(
  ['app', 'user', 'categories'], // working as 'state => ({ ...state.app, ...state.user, ...state.categories })' in @connect react-redux
  { ...actionCreators.app, ...actionCreators.posts }, // working as 'bindActionCreators({ ...actionCreators.app, ...actionCreators.posts })' in @connect react-redux
  [{ // we can pass array
    setAppSettings: 'app.settings'
  }, {
    setCategoriesSettings: 'categories.settings'
  }],
)
```

## Other example:

```js
import { connect } from 'reduceless-connect';

@connect(
  ['app.data.info', 'posts.example.test'], // working as 'state => ({ ...state.app.data.info, ...state.posts.example.test })' in @connect react-redux