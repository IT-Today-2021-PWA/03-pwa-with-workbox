import React from 'react';
import { Link } from 'react-router-dom';
import { useAsync } from '../utils';
import NavBar from '../components/NavBar';

export default function BookmarkPage() {
  const { status, value } = useAsync(getBookmark);

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-16 flex flex-col">
        <h1 className="mt-4 mb-4 text-lg font-semibold">Bookmark</h1>
        { ['idle', 'pending'].includes(status) && (
          <div className="flex-1 flex items-center justify-center py-4">
            <img className="animate-spin w-6 h-6 mr-3" src="/images/circle-loading-black.svg" alt="" />
            <p>Loading data...</p>
          </div>
        )}
        {(status === 'success' && value.length === 0) && (
          <>
            <p className="mb-1">Your bookmark is empty.</p>
            <p>
              To add a bookmark, go to homepage and click on an anime you like.
              {' '}
              Then on the anime detail page, click on the bookmark button.
            </p>
          </>
        )}
        {(status === 'success' && value.length > 0) && (
          <ul>
            {value.map((item) => (
              <li key={item.mal_id}>
                <Link to={`/detail?id=${item.mal_id}`}>
                  <div className="bg-white rounded-lg shadow flex p-2">
                    <figure className="flex-none" style={{ width: '96px' }}>
                      <img className="w-full rounded-lg" src={item.image_url} alt={`Poster for ${item.title}`} />
                    </figure>
                    <div className="flex-1 ml-4">
                      <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                      <p className="mb-1">{item.status}</p>
                      <p>{item.genres.map((genre) => genre.name).join(', ')}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <NavBar activeTab="bookmark" />
    </main>
  );
}

function getBookmark() {
  return new Promise(resolve => {
    caches.open('runtime').then(cache => {
      cache.keys().then(keys => {
        const validKeys = keys.filter(key => key.url.includes('/v3/anime/'));
        Promise.all(
          validKeys.map(key => cache.match(key).then(responseObj => responseObj))
        ).then(responseObjs => {
          Promise.all(
            responseObjs.map(responseObj => responseObj.json())
          ).then(responses => resolve(responses));
        });
      });
    });
  });
}
