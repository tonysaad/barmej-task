import React from "react";
import { connect } from 'react-redux'
import MoviesList from "./components/MoviesList";
import { fetchInitialMovies, fetchMovieByName, deleteMovie, markAsWatched, markAsUnWatched, searchMovieByString } from './actions';

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMovieName: '',
      searchVal: '',
    };
    this.addMovie = this.addMovie.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchInitialMovies());
  }
  addMovie() {
    const { dispatch } = this.props;
    dispatch(fetchMovieByName(this.state.newMovieName));
    this.setState({ newMovieName: '' });
  }
  searchMovies() {
    const { dispatch } = this.props;
    dispatch(searchMovieByString(this.state.searchVal));
  }
  deleteMovie(movie) {
    const { dispatch } = this.props;
    dispatch(deleteMovie(movie.imdbID));
  }
  watchToggleFn(movie) {
    const { dispatch } = this.props;
    dispatch(movie.watched ? markAsUnWatched(movie.imdbID) : markAsWatched(movie.imdbID));
  }
  render() {
    let { movies, searchStr } = this.props.movies;
    if (searchStr) {
      movies = movies.filter(m => (
        m.Title.toLowerCase().includes(searchStr)
        || m.Plot.toLowerCase().includes(searchStr)
        || m.Actors.toLowerCase().includes(searchStr)
      ));
    }
    const toBeWatched = movies.filter(m => !m.watched);
    const watchedList = movies.filter(m => m.watched);
    return (
      <div className="moviesContainer">
        <div className="moviesContainer__header">
          <div className="alignRight">
            <input
              type="text"
              placeholder="إضافة أسم فيلم جديد باللغة الإنجليزية..."
              value={this.state.newMovieName}
              onChange={e => this.setState({ newMovieName: e.target.value })}
              onKeyPress={e => (e.key === 'Enter') ? this.addMovie() : null}
            />
            <button onClick={() => this.addMovie()} ><i className="fas fa-video"></i> إضافة</button>
          </div>
          <div className="alignLeft">
            <input
              type="text"
              placeholder="أبحث عن فيلم من خلال أسمه باللغة الإنجليزية"
              value={this.state.searchVal}
              onChange={e => this.setState({ searchVal: e.target.value })}
              onKeyPress={e => (e.key === 'Enter') ? this.searchMovies() : null}
              onBlur={() => this.searchMovies()}
            />
            <button className="search" onClick={() => this.searchMovies()}><i className="fas fa-search"></i></button>
          </div>
        </div>
        {(!toBeWatched.length && !watchedList.length && searchStr) ? <p className="warningMsg">لا يوجد أفلام هنا، من فضلك غّير كلمة البحث</p> : null}
        <div className="row">
					<div className="col-6">
					<MoviesList
            title="الأفلام التي لم يتم مشاهدتها"
            movies={toBeWatched}
            deleteMovie={movie => this.deleteMovie(movie)}
            watchToggleFn={movie => this.watchToggleFn(movie)}
          />
					</div>
					<div className="col-6">
					<MoviesList
            title="الأفلام التي تم مشاهدتها"
            movies={watchedList}
            deleteMovie={movie => this.deleteMovie(movie)}
            watchToggleFn={movie => this.watchToggleFn(movie)}
          />
					</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.moviesReducer,
  }
}

export default connect(mapStateToProps)(Movies);
