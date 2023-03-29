// @flow
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import HistoricIngestionScreen from './HistoricIngestionScreen';
import type { Menu } from '../../types';
import dataSample from './data.json';
import moment from 'moment';
import { setHistoricData, setLoading } from '../../redux/modules/historicData';
import { setActivePage } from '../../redux/modules/isisTable';
import { filter } from 'underscore';
import debounce from 'debounce-async';
import { storageKey } from '../../config/constants';
import Storage from '../../utils/Storage';
import { setFlashNotification } from '../../redux/modules/flashNotification';

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
        fetch('./data.json')
            .then(response => {
                const json = response.json();

                console.log(json);

                return json;
            }).then(data => {
                dispatch(setHistoricData(data));
            });
        setLoading(false);
    };

    return <HistoricIngestionScreen
        loading={loading}
        sidebarMenu={sidebarMenu}
        table={table}
        history={history}
        data={data}/>;
}
