import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setPoliciesData } from '../../redux/modules/policies';
import CommunicationPoliciesScreen from './PoliciesScreen';
import type { Menu } from '../../types';

import dataSample from './data_sample.json';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationPoliciesContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { table } = useSelector(({ policies }) => policies);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Policies',
            path: '/communication_policies'
        }
    ];

    const loadPolicyData = async (activePage, pageSize, sort) => {
        setLoading(true);

        try {
            // const behaviours = await getBehaviours(activePage, pageSize, sort);
            // const { data, totalNoOfRecords, totalPages } = behaviours.data;
            const policies = dataSample;

            console.log(JSON.stringify(policies));
            const { data, totalNoOfRecords, totalPages } = policies.data;

            dispatch(setPoliciesData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const viewPolicyDetails = async row => {
        history.push(`/policies/${row.original.id}`);
    };

    const { pageSize, activePage, sort } = useSelector(({ table }) => table);

    useEffect(() => {
        loadPolicyData(activePage, pageSize, sort);
    }, [pageSize, activePage, sort]);

    return <CommunicationPoliciesScreen
        loading={loading}
        breadcrumb={breadcrumb}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}/>;
}
