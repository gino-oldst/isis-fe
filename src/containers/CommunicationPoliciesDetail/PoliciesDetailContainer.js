import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setPoliciesData } from '../../redux/modules/policies';
import CommunicationPoliciesDetailScreen from './PoliciesDetailScreen';
import type { Menu } from '../../types';

import { getKeywordSearch, getPolicySearchData } from '../../api/policies';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal } from '../CommunicationPolicies/modals';
import { setModalContent } from '../../redux/modules/modalEvent';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationPoliciesDetailContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const filters = useLocation();

    const [loading, setLoading] = useState(true);
    const { table } = useSelector(({ policiesDetail }) => policiesDetail);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Policies',
            path: '/communication_policies'
        },
        {
            label: filters.state.id,
            path: `communication-policies-detail/${filters.state.id}`,
            disabled: true
        }
    ];

    const { pageSize, activePage, sort } = useSelector(({ table }) => table);

    useEffect(() => {
        loadPolicyData(activePage, pageSize, sort);
    }, [pageSize, activePage, sort]);

    const loadPolicyData = async (activePage, pageSize, sort) => {
        setLoading(true);

        try {
            const policies = await getPolicySearchData(activePage, pageSize, sort);
            const { data, totalNoOfRecords, totalPages } = policies.data;

            data.map((policy, i) => {
                policy.keyword = policy.word;
                policy.alertId = `Alert ${policy.number} - ${getAlertCategoryName(policy.number)}`;
                policy.status = policy.deleted ? 'Disabled' : 'Enabled';
            });

            dispatch(setPoliciesData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const viewPolicyDetails = async row => {
        history.push(`/policies/${row.original.id}`);
    };

    // Modals
    const showPolicyCreateModal = () => {
        dispatch(setModalContent({
            modalContent: <CreateModal handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyEditModal = () => {
        dispatch(setModalContent({
            modalContent: <EditModal handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyDeleteModal = () => {
        dispatch(setModalContent({
            modalContent: <DeleteModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    return <CommunicationPoliciesDetailScreen
        loading={loading}
        breadcrumb={breadcrumb}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showPolicyDeleteModal={showPolicyDeleteModal}/>;
}
