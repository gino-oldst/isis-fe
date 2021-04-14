const fs = require('fs');
require.extensions['.js'] = function (module, filename) {
        module.exports = fs.readFileSync(filename, 'utf8');
}; // convert to string

const routes = require('../src/config/routes');

const help = `Adds a new React 'route' component.

This will create the new route folder (/src/containers/MyrouteName) and the routes files.

\`npm run create route MyRouteName\` or \`yarn run create route MyRouteName\`

`;

module.exports = async ({ cliArgs, cliFlags, makey, templage }) => {
    if (cliFlags['h']) {
        makey.print(help);
        return;
    }

    const routeName = makey.toLowerCaseFirst(
        cliArgs[0] || (await makey.ask('Name of your route:'))
    );
    if (!routeName) throw Error("Please provide a route name");

    const authTypeRaw = makey.toLowerCaseFirst(
        cliArgs[1] || (await makey.ask('Is this a private route? (y)es or (n)o:')) || 'y',
    );
    const authType = {
        y: true,
        n: false
    }[authTypeRaw[0].toLowerCase()];

    const RouteName = makey.toUpperCaseFirst(routeName);
    const containerName = `${RouteName}Container`;
    const screenName = `${RouteName}Screen`;
    const styleName = RouteName.replace(/([A-Z])/g, '-$1').replace('-', '').toLowerCase();
    let path = cliArgs[1];

    while(!path){
        const pathCli = await makey.ask('Please enter assign route path (/):');
        if(/\s/.pathCli){
            makey.print('Invalid Path!');
        }else{
            path = pathCli.toLowerCase();
        }
    }

    const containerBody = `// @flow
import React from 'react';
import ${screenName.replace('Sreen','')} from './${screenName}';

export default function ${containerName}(): React$Element<any> {
    return <${screenName.replace('Sreen','')} />;
}
`;

    const screenBody = `// @flow
import React from 'react';
import './${styleName}.scss';

type Props = {
    // TODO add props here
}

export default function ${screenName.replace('Sreen','')}(_: Props): React$Element<any> {
    return (
        <div className='${styleName}'>
            ${screenName.replace('Sreen','')}
        </div>
    );
}
`;

    const styleBody = `
@import '../../styles/utils/_variables';
@import '../../styles/utils/_mixins';

.${styleName} {

}
`;
    
    const routeBody = routes.replace('// ROUTE IMPORT CODE GENERATOR INDICATOR DO NOT DELETE',`const ${RouteName} = React.lazy(() => import('../containers/${RouteName}/${containerName}'));\n// ROUTE IMPORT CODE GENERATOR INDICATOR DO NOT DELETE`)
    .replace(' // ROUTE ENTRY CODE GENERATOR INDICATOR DO NOT DELETE',` {\n    path: '${path}',\n    name: '${RouteName}',\n    component: ${RouteName},\n    authedRoute: ${authType}\n}, // ROUTE ENTRY CODE GENERATOR INDICATOR DO NOT DELETE`);

    makey.createFile(
      `./src/containers/${RouteName}/${containerName}.js`,
      containerBody,
    );

    makey.createFile(
        `./src/containers/${RouteName}/${screenName}.js`,
        screenBody,
    );

    makey.createFile(
        `./src/containers/${RouteName}/${styleName}.scss`,
        styleBody,
    );

    makey.createFile(
        `./src/config/routes.js`,
        routeBody,
    );
}
