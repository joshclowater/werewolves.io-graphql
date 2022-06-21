# werewolves.io-graphql

## Backend

The backend of the project uses [AWS Amplify](https://docs.amplify.aws/lib/graphqlapi/getting-started/q/platform/js/) for its GraphQL implementation. [Install the Amplify CLI](https://docs.amplify.aws/cli/start/install/) and make updates by running the commands below from the root of the project folder:

```
amplify pull --appId d1hs8ia0wm3zp2 --envName dev
amplify push
```

## UI

The UI for this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the [Redux TypeScript template](https://github.com/reduxjs/cra-template-redux-typescript).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.


## Development

[VS Code](https://code.visualstudio.com/) is the recommended editor, along with the following extensions:
* [CSS Modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules)
