# Old.St Labs React Web App Template

## TODO

-   set `animation={false}` to Modal and add a transition. This will fix the error `Warning: findDOMNode is deprecated in StrictMode`
-   Flow name mapper (not working)
-   UI testing
-   Update script for create new route for setting which navigation it belong.

## Available Scripts

Clone repo

### `git clone https://gitlab.com/project-structure-templates/react-web-app.git`

Install packages

### `npm install --force` or `yarn install --force`

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Code-generation

The project comes with code creation to speed things up.

**Routes**

`npm run create route MyNewRoute` or `yarn run create route MyNewRoute`

This will create

```
├── containers
|   ├── MyNewRoute (New)
    |   ├── MyNewRouteContainer.js
    |   ├── MyNewRouteScreen.js
    |   ├── my-new-route.scss
└── ... other route containers
```

also import the route and add an entry in `routes` array of `/src/config/routes.js`

**Components**

`npm run create component MyNewComponent` or `yarn run create component MyNewComponent`

This will create

```
├── components
|   ├── MyNewComponent (New)
    |   ├── MyNewComponent.js
    |   ├── MyNewComponent.stories.js
    |   ├── my-new-component.scss
└── ... other components
```

In the event of error in node-sass
`yarn remove node-sass`

then

`yarn add sass`
