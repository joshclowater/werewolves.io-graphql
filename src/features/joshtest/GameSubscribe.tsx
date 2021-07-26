import * as React from "react";
import {
  useSubscription,
  gql
} from "@apollo/client";
import { OnUpdateGameSubscription } from "../../API";
import { onUpdateGame } from "../../graphql/subscriptions";

const ON_UPDATE_GAME = gql(onUpdateGame);

const Game = () => {
  const { loading, error, data } = useSubscription<OnUpdateGameSubscription>(
    ON_UPDATE_GAME,
    { 
      variables: { id: 'ea44f702-8c07-4a04-97c2-f933df526483' },
      fetchPolicy: 'network-only'}
  );

  console.log('GameSubscribe', { loading, error, data })

  return (<>
    <h2>Game Subscribed to: ea44f702-8c07-4a04-97c2-f933df526483</h2>
    {loading && <div>Loading...</div>}
    {error && <div>Error! ${error.message}</div>}
    <h3>{data?.onUpdateGame?.name}</h3>
    {data?.onUpdateGame?.players?.items?.map(player => <div key={player?.id}>{player?.name}</div>)}
  </>);
};

export default Game;