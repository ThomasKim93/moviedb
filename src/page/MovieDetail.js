import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube'; // react-youtube 패키지를 임포트합니다.

const API_KEY = 'f89a6c1f22aca3858a4ae7aef10de967';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const SMALL_IMAGE_SIZE = 'w200';
const LARGE_IMAGE_SIZE = 'https://image.tmdb.org/t/p/original/';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [showAllCast, setShowAllCast] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null); // YouTube 동영상 키

  useEffect(() => {
    // 영화 정보 및 출연 배우 목록을 가져오는 API 호출
    axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
      },
    })
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`${BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: API_KEY,
      },
    })
      .then(response => {
        setCast(response.data.cast);
      })
      .catch(error => {
        console.error(error);
      });

    // YouTube 동영상 정보 가져오기
    axios.get(`${BASE_URL}/movie/${id}/videos`, {
      params: {
        api_key: API_KEY,
      },
    })
      .then(response => {
        const results = response.data.results;
        if (results.length > 0) {
          setTrailerKey(results[0].key); // 첫 번째 동영상 키 설정
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  const displayedCast = showAllCast ? cast : cast.slice(0, 5);

  return (
    <div className="movie-detail">
        <div className="movie-detail2">
            <figure className="movie-poster-detail">
                <img
                className="movie-poster-detail_2"
                src={`${IMAGE_BASE_URL}${SMALL_IMAGE_SIZE}${movie.poster_path}`}
                alt={movie.title}
                />
            </figure>
            <div className="movie-align">
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
                <h3>Casts</h3>
                <ul className="movie-actor">
                {displayedCast.map(actor => (
                    <li key={actor.id}>
                    <img
                        className="movie-actor-img"
                        src={`${IMAGE_BASE_URL}${SMALL_IMAGE_SIZE}${actor.profile_path}`}
                        alt={actor.name}
                    />
                    {actor.name}
                    </li>
                ))}
                {!showAllCast && cast.length > 5 && (
                    <button onClick={() => setShowAllCast(true)}>출연배우 더보기</button>
                )}
                </ul>
        </div>
      </div>
      <figure className="movie-poster-background">
        <img
          className="movie-poster-background2"
          src={`${IMAGE_BASE_URL}${LARGE_IMAGE_SIZE}${movie.backdrop_path}`}
          alt={movie.title}
          />
        <div class="gradient-overlay"></div>

      </figure>
      <div className="trailer">
        <h2>Trailer</h2>
          {trailerKey && (
            <div className="youtube-container">
              <YouTube videoId={trailerKey} /> {/* YouTube 컴포넌트로 동영상 표시 */}
            </div>
          )}

      </div>
    </div>
  );
}

export default MovieDetail;