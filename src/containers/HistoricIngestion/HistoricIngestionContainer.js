// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import HistoricIngestionScreen from './HistoricIngestionScreen';
import { getData } from '../../api/historicIngestion';
import type { Menu } from '../../types';
import { setHistoricData, setLoading } from '../../redux/modules/historicData';

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

    const { table } = useSelector(({ historicData }) => historicData);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            await getData().then((result) => {
                console.log(result);

                dispatch(setHistoricData(result.data, result.data.length, result.data.length / 10));
            });
        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    };

    return <HistoricIngestionScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        table={table}
        history={history}
        data={data}/>;
}
