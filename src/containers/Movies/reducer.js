import * as types from './constants'

const initialState = {
	isFetching: false,
	movies: [],
	searchStr: null,
}

export default function moviesReducer(state = initialState, action) {
  switch (action.type) {
		case types.FETCH_INITIAL_MOVIES:
      return Object.assign({}, state, {
        isFetching: true,
			});

    case types.RECEIVE_INITIAL_MOVIES:
      return Object.assign({}, state, {
        isFetching: false,
        movies: (action.movies) ? action.movies.map(m => Object.assign({}, m, { watched: false })) : [],
        lastUpdated: Date.now()
			});

		case types.RECEIVE_MOVIE:
			return Object.assign({}, state, {
				isFetching: false,
				movies: [
					Object.assign({}, action.movieJson, { watched: false }),
					...state.movies
				],
				lastUpdated: Date.now()
			});

		case types.DELETE_MOVIE:
			return Object.assign({}, state, {
				isFetching: false,
				movies: state.movies.filter(todo =>
					todo.imdbID !== action.id
				),
				lastUpdated: Date.now()
			});

		case types.MARK_MOVIE_AS_WATCHED:
			return Object.assign({}, state, {
				isFetching: false,
				movies: state.movies.map(movie =>
					movie.imdbID === action.id ?
						{ ...movie, watched: true } :
						movie
				),
				lastUpdated: Date.now()
			});

		case types.MARK_MOVIE_AS_UNWATCHED:
			return Object.assign({}, state, {
				isFetching: false,
				movies: state.movies.map(movie =>
					movie.imdbID === action.id ?
						{ ...movie, watched: false } :
						movie
				),
				lastUpdated: Date.now()
			});

		case types.SEARCH_MOVIES:
			return Object.assign({}, state, {
				searchStr: action.str,
			});

    default:
      return state
  }
}
