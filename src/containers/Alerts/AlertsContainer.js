// @flow
import React, { useState, useEffect } from 'react';
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
    const [filterOptions, setFilterOptions] = useState({});
    const [alerts, setAlerts] = useState({
        data: [],
        currentPage: 1,
        dataPerPage: 10,
        totalPages: 0
    });

    const viewAlertDetails = async (path, data) => {
        await dispatch(setSelectedAlert(data));

        history.push(path);
    };

    useEffect(() => {
        if (table.data !== undefined && table.data.length > 0) {
            getColumnFilterOptions();
            getTablePagination();
        }
    }, []);

    useEffect(() => {
        getTablePagination();
    }, [alerts.currentPage]);

    const getColumnFilterOptions = () => {
        const cols = {};

        Object.keys(table.data[0]).map(key => {
            cols[key.toLowerCase()] = [];
        });

        table.data.map(data => {
            Object.keys(data).map(key => {
                cols[key.toLowerCase()].push(data[key]);
            });
        });

        Object.keys(cols).map(col => {
            cols[col] = [...new Set(cols[col])];
        });

        setFilterOptions(cols);
    };

    const getTablePagination = () => {
        // Logic for displaying todos
        const indexOfLastData = alerts.currentPage * alerts.dataPerPage;
        const indexOfFirstData = indexOfLastData - alerts.dataPerPage;
        const currentData = table.data.slice(indexOfFirstData, indexOfLastData);

        setAlerts({
            ...alerts,
            data: currentData,
            totalPages: (table.data.length % alerts.dataPerPage) > 0 ? parseInt(table.data.length / alerts.dataPerPage) + 1 : parseInt(table.data.length / alerts.dataPerPage)
        });
    };

    return <AlertsScreen
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        tableColumns={table.columns}
        tableData={alerts.data}
        paginationData={alerts}
        setPaginationData={setAlerts}
        viewAlertDetails={viewAlertDetails}
        sidebarMenu={sidebarMenu} />;
}
