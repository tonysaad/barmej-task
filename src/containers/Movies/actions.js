// Do this in every file where you use `fetch`, Read: https://redux.js.org/advanced/async-actions#note-on-fetch
import fetch from 'cross-fetch';
import * as types from './constants';

const API_KEY = '38476d0e';

export const addMovie = movieName => ({ type: types.ADD_MOVIE, movieName });
export const receiveMovie = (movieName, movieJson) => ({ type: types.RECEIVE_MOVIE, movieName, movieJson });
export const deleteMovie = id => ({ type: types.DELETE_MOVIE, id });
export const markAsWatched = id => ({ type: types.MARK_MOVIE_AS_WATCHED, id });
export const markAsUnWatched = id => ({ type: types.MARK_MOVIE_AS_UNWATCHED, id });
export const searchMovieByString = str => ({ type: types.SEARCH_MOVIES, str });

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchMovie('Rocky Balboa'))

export function fetchInitialMovies(initialMoviesKeyword = 'rocky', maxMoviesToShow = 5) {
	// Thunk middleware knows how to handle functions.
	// It passes the dispatch method as an argument to the function,
	// thus making it able to dispatch actions itself.

	return function(dispatch) {
		// First dispatch: the app state is updated to inform
		// that the API call is starting.

		dispatch({ type: types.FETCH_INITIAL_MOVIES });

		// The function called by the thunk middleware can return a value,
		// that is passed on as the return value of the dispatch method.

		// In this case, we return a promise to wait for.
		// This is not required by thunk middleware, but it is convenient for us.

		return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${initialMoviesKeyword}`)
			.then(
				response => response.json(),
				// Do not use catch, because that will also catch
				// any errors in the dispatch and resulting render,
				// causing a loop of 'Unexpected batch number' errors.
				// https://github.com/facebook/react/issues/6895
				error => console.log('An error occurred.', error)
			)
			.then(json => {
				// We can dispatch many times!
				// Here, we update the app state with the results of the API call.
				if (json.Search && json.Search.length >= 1) {
					json.Search.forEach((movie, index) => {
						if (index <= maxMoviesToShow) {
							return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
								.then(
									response => response.json(),
									error => console.log('An error occurred.', error)
								)
								.then(movieJson =>
									(!movieJson.Error) ? dispatch(receiveMovie({movieName: movieJson.Title}, movieJson)) : null
								);
						}
					});
				}
			});
	}
}

export function fetchMovieByName(movieName) {
	return function(dispatch) {
		dispatch(addMovie(movieName));
		return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${movieName}`)
			.then(
				response => response.json(),
				error => console.log('An error occurred.', error)
			)
			.then(movieJson =>
				(!movieJson.Error) ? dispatch(receiveMovie(movieName, movieJson)) : null
			);
	}
}
