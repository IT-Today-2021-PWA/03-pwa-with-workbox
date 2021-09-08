import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAsync, useQuery } from '../utils';
import { getApiUrl, getAnimeDetail } from '../api';

export default function DetailPage() {
  const history = useHistory();
  const query = useQuery();
  const id = query.get('id');
  const apiUrl = getApiUrl(`/anime/${id}`);

  const apiGetAnimeDetail = React.useCallback(() => getAnimeDetail(id), [id]);

  const { status, value, execute } = useAsync(apiGetAnimeDetail);

  const getYoutubeUrl = (trailerUrl) => {
    const newUrl = new URL(trailerUrl);
    const searchParams = ['enablejsapi', 'wmode', 'autoplay'];
    searchParams.forEach(key => newUrl.searchParams.delete(key));
    return newUrl.toString();
  };

  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const onClickBookmark = React.useCallback(() => {
    if (value && !isBookmarked) {
      caches.open('runtime').then(cache => {
        cache.add(apiUrl);
        setIsBookmarked(true);
      });
    }
  }, [value, id, isBookmarked, caches]);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';

    caches.match(apiUrl).then(cachedResponse => {
      if (cachedResponse) {
        setIsBookmarked(true);
      }
    });

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-gray-100">
      <section className="max-w-2xl mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <nav className="flex-none flex items-center w-full shadow">
          <button className="p-4" onClick={() => history.goBack()}>
            <img className="w-8 h-8" src="/images/arrow-left.svg" alt="" />
            <span className="sr-only">Go Back</span>
          </button>
        </nav>
        { id ? (
          <>
            {
              ['idle', 'pending'].includes(status) && (
                <div className="flex-1 flex items-center justify-center py-4">
                  <img className="animate-spin w-6 h-6 mr-3" src="/images/circle-loading-black.svg" alt="" />
                  <p>Loading data...</p>
                </div>
              )
            }
            {
              status === 'error' && (
                <div className="flex-1 w-full px-4 flex flex-col items-center justify-center text-center">
                  <p>Fetching data is error.</p>
                  <p>Try again later by clicking on the refresh button.</p>
                  <div className="mt-2">
                    <button className="inline-flex items-center px-2 py-1 rounded-lg border border-gray-400" onClick={execute}>
                      <img className="w-4 h-4 mr-2" src="/images/refresh.svg" alt="" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              )
            }
            {
              status === 'success' && (
                <div className="w-full flex-1 overflow-y-auto">
                  {value.data.trailer_url && (
                    <div
                      className="w-full relative"
                      style={{
                        paddingTop: '56.25%',
                      }}>
                      <iframe
                        className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                        src={getYoutubeUrl(value.data.trailer_url)}
                        title={`Trailer ${value.data.title}`}
                        allowFullScreen
                        frameBorder={0}
                       />
                    </div>
                  )}
                  <article className="p-4">
                    <header className="flex mb-4">
                      <figure className="flex-none" style={{ width: '128px' }}>
                        <img className="w-full rounded-lg" src={value.data.image_url} alt={`Poster for ${value.data.title}`} />
                      </figure>
                      <div className="flex-1 ml-4">
                        <div className="flex mb-2">
                          <h2 className="flex-1 text-lg font-semibold mb-2 mr-2">{value.data.title}</h2>
                          {value.data.score && (
                            <div className="flex-none">
                              <span className="p-2 inline-block font-semibold text-lg rounded bg-gray-100">{value.data.score}</span>
                            </div>
                          )}
                        </div>
                        <dl>
                          <div className="flex mb-1">
                            <dt className="flex-none font-semibold" style={{ width: '72px' }}>Status:</dt>
                            <dd className="break-words">{value.data.status}</dd>
                          </div>
                          <div className="flex mb-1">
                            <dt className="flex-none font-semibold" style={{ width: '72px' }}>Aired:</dt>
                            <dd className="break-words">{value.data.aired.string}</dd>
                          </div>
                          <div className="flex mb-1">
                            <dt className="flex-none font-semibold" style={{ width: '72px' }}>Rating:</dt>
                            <dd className="break-words">{value.data.rating}</dd>
                          </div>
                          <div className="flex mb-1">
                            <dt className="flex-none font-semibold" style={{ width: '72px' }}>Genres:</dt>
                            <dd className="break-words">
                              {value.data.genres.map(genre => genre.name).join(', ')}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </header>
                    <div className="flex items-center mb-4">
                      <button
                        className={`flex items-center py-2 px-4 rounded-lg text-white ${isBookmarked ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'}`}
                        onClick={onClickBookmark}>
                        <img className="w-6 h-6 mr-2" src="/images/bookmark-white.svg" alt="" />
                        <span>
                          {isBookmarked ? 'Bookmarked' : 'Bookmark This Page'}
                        </span>
                      </button>
                    </div>
                    <section>
                      <h3 className="font-semibold mb-2">Synopsis</h3>
                      <p>{value.data.synopsis}</p>
                    </section>
                  </article>
                </div>
              )
            }
          </>
        ) : (
          <p className="flex-1 flex items-center justify-center py-4">
            Page Not Found
          </p>
        )}
      </section>
    </div>
  );
}
