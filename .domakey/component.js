
const help = `Adds a new React reusable component.

This will create the new folder (/src/components/MyComponentName).

\`npm run create component MyComponentName\` or \`yarn run create component MyComponentName\`
`;

module.exports = async ({ cliArgs, cliFlags, makey }) => {
    if (cliFlags['h']) {
        makey.print(help);
        return;
    }

    const componentName = makey.toLowerCaseFirst(
        cliArgs[0] || (await makey.ask('Name of your component:'))
    );
    if (!componentName) throw Error("Please provide a component name");
    const compTypeRaw = makey.toLowerCaseFirst(
        cliArgs[1] || (await makey.ask('What is the type of the component? (m)odules or (b)ase:')) || 'm',
    );
    const compType = {
        m: 'modules',
        b: 'base'
    }[compTypeRaw[0].toLowerCase()];
    const smartComponent = cliFlags['y']
        ? true
        : cliFlags['container'] || (await makey.askYN('Create a (smart) container for the Comp?'));

    const ComponentName = makey.toUpperCaseFirst(componentName);
    const styleName = ComponentName.replace(/([A-Z])/g, '-$1').replace('-', '').toLowerCase();

    const componentBody = `// @flow
import React from 'react';
import './${styleName}.scss';

type Props = {
    className?: string
}

export default function ${ComponentName}({ className = '' }: Props): React$Element<any> {
    return (
        <div className={` + '`' + `${styleName}` + ' ${className}`' + `} >
            ${ComponentName}
        </div>
    );
}
`;

    const containerBody = `// @flow
import React from 'react';
import ${ComponentName} from './${ComponentName}';

type Props = {
    className?: string
}

export default function ${ComponentName}Container({ className = '' }: Props): React$Element<any> {
    return (
        <${ComponentName} className={className} />
    );
}
`;

    const storyBody = `import React from 'react';
import ${ComponentName} from './${ComponentName}${smartComponent ? 'Container' : ''}';

const config = {
    title: 'Components/${ComponentName}',
    component: ${ComponentName},
    argTypes: {
        // TODO add argTypes
    }
};

export default config;

const Template = (args) => <${ComponentName} {...args} />;

export const Sample = Template.bind({});
Sample.args = {
    // TODO add args
};
`
    const styleBody = `
@import '../../../styles/utils/_variables';
@import '../../../styles/utils/_mixins';

.${styleName} {

}
`;
    makey.createFile(
        `./src/components/${compType}/${ComponentName}/${ComponentName}.js`,
        componentBody,
    );
    
    if (smartComponent) {
        makey.createFile(
            `./src/components/${compType}/${ComponentName}/${ComponentName}Container.js`,
            containerBody,
        );
    }

    makey.createFile(
        `./src/components/${compType}/${ComponentName}/${ComponentName}.stories.js`,
        storyBody,
    );

    makey.createFile(
        `./src/components/${compType}/${ComponentName}/${styleName}.scss`,
        styleBody,
    );
}
