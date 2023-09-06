import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';

const API_KEY = 'f89a6c1f22aca3858a4ae7aef10de967';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const SMALL_IMAGE_SIZE = 'w200';
const LARGE_IMAGE_SIZE = 'https://image.tmdb.org/t/p/original/';

function TvSeriesDetail() {
  const { id } = useParams();
  const [tvSeries, setTvSeries] = useState(null);
  const [cast, setCast] = useState([]);
  const [showAllCast, setShowAllCast] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    // TV 시리즈 정보를 가져오는 API 호출
    axios.get(`${BASE_URL}/tv/${id}`, {
      params: {
        api_key: API_KEY,
      },
    })
      .then(response => {
        setTvSeries(response.data);
      })
      .catch(error => {
        console.error(error);
      });

      axios.get(`${BASE_URL}/tv/${id}/credits`, {
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
    axios.get(`${BASE_URL}/tv/${id}/videos`, {
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

  if (!tvSeries) {
    return <div>Loading...</div>;
  }

   const displayedCast = showAllCast ? cast : cast.slice(0, 5);

  return (

    <div className="movie-detail">
        <div className="movie-detail2">
            <figure className="movie-poster-detail">
                <img
                className="movie-poster-detail_2"
                src={`${IMAGE_BASE_URL}${SMALL_IMAGE_SIZE}${tvSeries.poster_path}`}
                alt={tvSeries.name}
                />
            </figure>
            <div className="movie-align">
                <h2>{tvSeries.title}</h2>
                <p>{tvSeries.overview}</p>
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
          src={`${IMAGE_BASE_URL}${LARGE_IMAGE_SIZE}${tvSeries.backdrop_path}`}
          alt={tvSeries.title}
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

export default TvSeriesDetail;