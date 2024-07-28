import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlayerArchives, getPlayerGamesByArchive } from './chessApiService';

const Dashboard = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const user = searchParams.get('username');
    setUsername(user);

    if (user) {
      getPlayerArchives(user)
        .then(data => {
          const archives = data.archives;
          if (archives.length > 0) {
            const latestArchiveUrl = archives[archives.length - 1];
            getPlayerGamesByArchive(latestArchiveUrl)
              .then(allGames => {
                const last10Games = allGames.slice(-10);
                setGames(last10Games);
                setLoading(false);
              })
              .catch(err => {
                setError('Failed to fetch games.');
                setLoading(false);
              });
          } else {
            setError('No game archives found.');
            setLoading(false);
          }
        })
        .catch(err => {
          setError('Failed to fetch archives.');
          setLoading(false);
        });
    } else {
      setError('No username provided.');
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard for {username}</h1>
      <h2>Last 10 Games</h2>
      <ul>
        {games.map((game, index) => (
          <li key={index}>
            {game.white.username} vs {game.black.username} - Result: {game.white.result} / {game.black.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
