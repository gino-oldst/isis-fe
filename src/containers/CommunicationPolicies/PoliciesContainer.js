import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setKeywords, setPoliciesData } from '../../redux/modules/policies';
import CommunicationPoliciesScreen from './PoliciesScreen';
import type { Menu } from '../../types';

import dataSample from './data_sample.json';
import { getAlertPoliciesData, getKeywordSearch, getPolicySearchData } from '../../api/policies';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal } from './modals';
import { setModalContent } from '../../redux/modules/modalEvent';

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
    const [selectedKeywords, setSelectedKeywords] = useState([]);
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

    const { pageSize, activePage, sort } = useSelector(({ table }) => table);

    useEffect(() => {
        loadPolicyData(activePage, pageSize, sort);
    }, [pageSize, activePage, sort]);

    const loadPolicyData = async (activePage, pageSize, sort) => {
        setLoading(true);

        try {
            // const policies = await getPolicySearchData(activePage, pageSize, sort);
            // data.map((policy, i) => {
            //     policy.keyword = policy.word;
            //     policy.alertId = `Alert ${policy.number} - ${getAlertCategoryName(policy.number)}`;
            //     policy.status = policy.deleted ? 'Disabled' : 'Enabled';
            // });
            const alertPolicies = await getAlertPoliciesData(activePage, pageSize, sort);
            const keywords = await getKeywordSearch();

            const { data, totalNoOfRecords, totalPages } = alertPolicies.data;

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

    // Handlers
    const handleSelectedKeywordsChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            console.log(op);
            list.push(op);
        });

        setSelectedKeywords(list);

        console.log(updatedList, selectedKeywords);
        // setRecipients(list);
    };

    // Modals
    const showPolicyCreateModal = () => {
        // TODO: Refresh the Keywords
        dispatch(setModalContent({
            modalContent: <CreateModal onChange={handleSelectedKeywordsChange} handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyEditModal = (id, name, type) => {
        // TODO: Filter by id to get specific keywords
        console.log(id, name, type);
        console.log('edit!');

        dispatch(setModalContent({
            modalContent: <EditModal handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyDeleteModal = () => {
        // TODO: Passing of the ID of the Category
        dispatch(setModalContent({
            modalContent: <DeleteModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    // Redirect
    const viewCommunicationPolicyDetails = async (id, name, type) => {
        history.push({
            pathname: `/communication-policies-detail/${id}`,
            state: { id: id, name: name, type: type }
        });
    };

    return <CommunicationPoliciesScreen
        loading={loading}
        breadcrumb={breadcrumb}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showPolicyDeleteModal={showPolicyDeleteModal}
        viewCommunicationPolicyDetails={viewCommunicationPolicyDetails}/>;
}
