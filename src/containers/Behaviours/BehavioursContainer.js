// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BehavioursScreen from './BehavioursScreen';
import type { Menu } from '../../types';
import { setSelectedBehaviour } from '../../redux/modules/behaviours';

type Props = {
    sidebarMenu: Array<Menu>
}

export default function BehavioursContainer({
    sidebarMenu
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
    const { table } = useSelector(({ behaviours }) => behaviours);
    const [behaviours, setBehaviours] = useState({
        data: [],
        currentPage: 1,
        dataPerPage: 5,
        totalPages: 0
    });

    const viewBehaviourDetails = async (path, identifier, behaviour) => {
        await dispatch(setSelectedBehaviour(identifier, behaviour));

        history.push(path);
    };

    useEffect(() => {
        if (table.data !== undefined && table.data.length > 0) getTablePagination();
    }, []);

    useEffect(() => {
        getTablePagination();
    }, [behaviours.currentPage]);

    const getTablePagination = () => {
        // Logic for displaying todos
        const indexOfLastData = behaviours.currentPage * behaviours.dataPerPage;
        const indexOfFirstData = indexOfLastData - behaviours.dataPerPage;
        const currentData = table.data.slice(indexOfFirstData, indexOfLastData);

        setBehaviours({
            ...behaviours,
            data: currentData,
            totalPages: (table.data.length % behaviours.dataPerPage) > 0 ? parseInt(table.data.length / behaviours.dataPerPage) + 1 : parseInt(table.data.length / behaviours.dataPerPage)
        });
    };

    return <BehavioursScreen
        tableColumns={table.columns}
        tableData={behaviours.data}
        paginationData={behaviours}
        setPaginationData={setBehaviours}
        viewBehaviourDetails={viewBehaviourDetails}
        sidebarMenu={sidebarMenu} />;
}
