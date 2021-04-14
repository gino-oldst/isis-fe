// @flow
import * as React from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import Storage from '../../../utils/Storage';
import { usePathname } from '../../../utils/Route';
import { storageKey } from '../../../config/constants';
import type { Menu } from '../../../types';

type Props = {
    className?: string,
    children?: any,
    menu?: Array<Menu>
}

export default function CollapsibleSidebarContainer(props: Props): React$Element<any> {
    const pathName = usePathname();

    const [isOpen, setToggleOpen] = React.useState(true);

    const handleToggleSidebar = () => {
        const updateState = !isOpen;

        setToggleOpen(updateState);
        Storage.setItem(storageKey.sidebarState, JSON.stringify(updateState));
    };

    return (
        <CollapsibleSidebar
            {...props}
            pathName={pathName}
            handleToggleSidebar={handleToggleSidebar}
            isOpen={isOpen} />
    );
}
