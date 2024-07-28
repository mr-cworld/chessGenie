import ChessWebAPI from 'chess-web-api';

const chessAPI = new ChessWebAPI();
chessAPI.baseUrl = 'https://api.chess.com';
chessAPI.headers = {}; // Ensure no headers are set that could be blocked

export const getPlayerProfile = async (username) => {
  try {
    const response = await chessAPI.getPlayer(username);
    return response.body;
  } catch (error) {
    throw new Error('Failed to fetch player profile');
  }
};

export const getPlayerArchives = async (username) => {
  try {
    const response = await chessAPI.getPlayerCompleteMonthlyArchives(username);
    const archives = response.body.archives;
    if (archives.length > 0) {
      const latestArchiveUrl = archives[archives.length - 1];
      const urlParts = latestArchiveUrl.split('/');
      const year = urlParts[urlParts.length - 2];
      const month = urlParts[urlParts.length - 1];

      const gamesResponse = await chessAPI.getPlayerCompleteMonthlyArchives(username, year, month);
      return gamesResponse.body.games.slice(-10);
    } else {
      throw new Error('No game archives found.');
    }
  } catch (error) {
    throw new Error('Failed to fetch game archives');
  }
};
