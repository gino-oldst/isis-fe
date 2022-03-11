import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setPoliciesData } from '../../redux/modules/policies';
import CommunicationPoliciesScreen from './PoliciesScreen';
import type { Menu } from '../../types';

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
            const policies = {
                totalNoOfRecords: 11,
                totalPages: 2,
                totalCurrentElements: 10,
                data: [
                    {
                        id: 'Alert 1',
                        keyword: 'Bloody',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 2',
                        keyword: 'Shit',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 3',
                        keyword: 'Retard',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 4',
                        keyword: 'Flame',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 5',
                        keyword: 'Bot',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 6',
                        keyword: 'Donec sollicitudin',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 7',
                        keyword: 'Queer',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 8',
                        keyword: 'Shitty',
                        status: 'Enabled'
                    },
                    {
                        id: 'Alert 9',
                        keyword: 'Acknowledge',
                        status: 'Disabled'
                    },
                    {
                        id: 'Alert 10',
                        keyword: 'Avg',
                        status: 'Enabled'
                    }
                ],
                responseStatus: 'success'
            };

            console.log(policies.data);
            const { data, totalNoOfRecords, totalPages } = policies.data;

            console.log(data, totalNoOfRecords, totalPages);
            dispatch(setPoliciesData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const viewPolicyDetails = async row => {
        history.push(`/policies/${row.original.id}`);
    };

    return <CommunicationPoliciesScreen
        loading={loading}
        breadcrumb={breadcrumb}
        tableColumns={table.columns}
        tableData={table.data}
        loadPoliciesData={loadPolicyData}
        sidebarMenu={sidebarMenu}/>;
}
