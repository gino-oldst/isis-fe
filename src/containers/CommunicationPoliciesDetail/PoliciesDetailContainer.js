import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setKeywords, setPoliciesData } from '../../redux/modules/policies';
import CommunicationPoliciesDetailScreen from './PoliciesDetailScreen';
import type { Menu } from '../../types';

import { getAlertPolicyDataByID, getKeywordSearch, getKeywordSearchNumbered, getPolicymapById, getPolicySearchData } from '../../api/policies';
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
    const [categoryName, setCategoryName] = useState('');
    const [type, setType] = useState('');

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
            const policyData = await getAlertPolicyDataByID(filters.state.id);

            setCategoryName(policyData.name);
            setType(policyData.internalCode);

            // Map Keywords to Policy Map
            const policyMapData = await getPolicymapById(activePage, pageSize, sort, { id: filters.state.id });
            const keywords = await getKeywordSearchNumbered();
            const keywordsModal = await getKeywordSearch();

            const { data, totalNoOfRecords, totalPages } = policyMapData.data;

            data.map((policyMap) => {
                var keyword = keywords.filter(a => a.id == policyMap.keywordId)[0];

                policyMap.word = keyword.label;
                policyMap.number = keyword.number;
            });

            dispatch(setPoliciesData(data, totalNoOfRecords, totalPages));
            dispatch(setKeywords(keywords));
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
        categoryName={categoryName}
        type={type}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showPolicyDeleteModal={showPolicyDeleteModal}/>;
}
