// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import HistoricIngestionScreen from './HistoricIngestionScreen';
import { getData, purgeHistoricData } from '../../api/historicIngestion';
import type { Menu } from '../../types';
import historicData, { setHistoricData, setLoading } from '../../redux/modules/historicData';
import { setActivePage, setTablePageSize } from '../../redux/modules/isisTable';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function,
    useMediaQuery: Function,
}

export default function HistoricIngestionContainer({
    sidebarMenu,
    handleCloseModal,
    useMediaQuery
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewModal, setViewModal] = useState(false);

    const { pageSize, activePage, isTablePageSelect } = useSelector(({ isisTable }) => isisTable);
    const { table } = useSelector(({ historicData }) => historicData);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        const insidePage = 0;

        try {
            await getData().then((result) => {
                console.log(result);

                dispatch(setHistoricData(result.data, result.data.length, Math.ceil(result.data.length / 10)));
                dispatch(setActivePage(insidePage));
            });
        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    };

    const purgeData = async (data) => {
        await purgeHistoricData(data).then((result) => {
            console.log(result);
        });
    };

    return <HistoricIngestionScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        table={table}
        history={history}
        data={data}
        setViewModal={setViewModal}
        viewModal={viewModal}
        purgeHistoricData={purgeData}
        handleCloseModal={handleCloseModal}
        activePage={activePage}
        pageSize={pageSize}/>;
}
