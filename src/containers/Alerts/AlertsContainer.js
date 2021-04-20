// @flow
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AlertsScreen from './AlertsScreen';
import type { Menu } from '../../types';
import { setSelectedAlert } from '../../redux/modules/alerts';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function AlertsContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const { table } = useSelector(({ alerts }) => alerts);

    const viewAlertDetails = async (path, data) => {
        await dispatch(setSelectedAlert(data));

        history.push(path);
    };

    return <AlertsScreen
        tableColumns={table.columns}
        tableData={table.data}
        viewAlertDetails={viewAlertDetails}
        sidebarMenu={sidebarMenu} />;
}
