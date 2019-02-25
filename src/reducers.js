import { combineReducers } from 'redux';
import moviesReducer from './containers/Movies/reducer';

const rootReducer = combineReducers({
	moviesReducer,
});

export default rootReducer;
