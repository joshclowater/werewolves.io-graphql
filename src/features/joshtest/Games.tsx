import * as React from "react";
import {
  useQuery,
  gql
} from "@apollo/client";
import { ListGamesQuery } from "../../API";
import { listGames } from "../../graphql/queries";

const LIST_GAMES = gql(listGames);

const Games = () => {
  const { loading, error, data } = useQuery<ListGamesQuery>(LIST_GAMES);

  return (<>
    <h2>All Games</h2>
    {loading && <div>Loading...</div>}
    {error && <div>Error! ${error.message}</div>}
    {data?.listGames?.items?.map(game => 
        <div key={game?.id}>
          {game?.name}
        </div>

      )}
  </>);
};

export default Games;