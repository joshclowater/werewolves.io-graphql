/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayerForGame = /* GraphQL */ `
  subscription OnCreatePlayerForGame($gameID: ID!) {
    onCreatePlayerForGame(gameID: $gameID) {
      id
      name
      role
      deceased
      gameID
      game {
        id
        name
        status
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGameForId = /* GraphQL */ `
  subscription OnUpdateGameForId($id: ID!) {
    onUpdateGameForId(id: $id) {
      id
      name
      status
      players {
        items {
          id
          name
          role
          deceased
          gameID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePlayerForId = /* GraphQL */ `
  subscription OnUpdatePlayerForId($id: ID!) {
    onUpdatePlayerForId(id: $id) {
      id
      name
      role
      deceased
      gameID
      game {
        id
        name
        status
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      name
      status
      players {
        items {
          id
          name
          role
          deceased
          gameID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      name
      status
      players {
        items {
          id
          name
          role
          deceased
          gameID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      name
      status
      players {
        items {
          id
          name
          role
          deceased
          gameID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
      name
      role
      deceased
      gameID
      game {
        id
        name
        status
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
      id
      name
      role
      deceased
      gameID
      game {
        id
        name
        status
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
      id
      name
      role
      deceased
      gameID
      game {
        id
        name
        status
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
