export type ListGamesWithPlayersQuery = {
  listGames?:  {
    __typename: "ModelGameConnection",
    items:  Array< {
      __typename: "Game",
      id: string,
      name: string,
      status: string,
      expirationUnixTime: number,
      players?:  {
        __typename: "ModelPlayerConnection",
        items:  Array< {
          __typename: "Player",
          id: string,
          name: string,
          role?: string | null,
          deceased?: boolean | null,
          pick?: string | null,
          expirationUnixTime: number,
          gameID: string,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};