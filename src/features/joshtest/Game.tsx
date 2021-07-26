import * as React from "react";
import {
  useQuery,
  gql
} from "@apollo/client";
import { GetGameQuery, GetGameQueryVariables } from "../../API";
import { getGame } from "../../graphql/queries";

const GET_GAME = gql(getGame);

const Game = () => {
  const { loading, error, data } = useQuery<GetGameQuery, GetGameQueryVariables>(
    GET_GAME,
    { variables: { id: 'ea44f702-8c07-4a04-97c2-f933df526483' } }
  );

  return (<>
    <h2>Game ea44f702-8c07-4a04-97c2-f933df526483</h2>
    {loading && <div>Loading...</div>}
    {error && <div>Error! ${error.message}</div>}
    {data?.getGame?.players?.items?.map(player => <div key={player?.id}>{player?.name}</div>)}
  </>);
};

export default Game;