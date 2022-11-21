import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setKeywords, setPoliciesData, setPolicyForm } from '../../redux/modules/profiles';
import ProfilesScreen from './ProfilesScreen';
import type { Menu } from '../../types';
import { deletePolicyMap, getAlertPoliciesData, deletePolicy, getKeywordSearch, getPolicymapById, getPolicymapByIdRaw, getPolicyMapByIdRaw, getPolicySearchData, postNewKeyword, postNewPolicy, postNewPolicyMap, updatePolicy, updatePolicyMap } from '../../api/profiles';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal, SuccessModal } from './modals';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setFlashNotification } from '../../redux/modules/flashNotification';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function ProfilesContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState({});
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [searchData, setSearchData] = useState('');
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Profiles',
            path: '/profiles'
        }
    ];

    const { pageSize, activePage, sort } = useSelector(({ table }) => table);
    const { table, form, keywords } = useSelector(({ profiles }) => profiles);

    useEffect(() => {
        loadPolicyData(activePage, pageSize, sort, searchData, searchData);
    }, [pageSize, activePage, sort]);

    const loadPolicyData = async (activePage, pageSize, sort, searchName) => {
        setLoading(true);

        try {
            const alertPolicies = await getAlertPoliciesData(activePage, pageSize, sort, searchName);
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

    const reload = () => {
        loadPolicyData(activePage, pageSize, sort, searchData);
    };

    const onChange = e => {
        const { value } = e.target;

        setSearchData(value);
    };

    // Handlers
    const onCreateSubmit = async (name, type, selectedItems) => {
        try {
            var policy = [];

            await postNewPolicy({
                internalCode: type.value,
                name: name,
                description: `List of keywords for ${name}`,
                status: 0
            }).then(x => {
                policy = x;
            });

            const promises = selectedItems.map(item => {
                const data = {
                    keywordId: item.id,
                    policyId: policy.id
                };

                const request = postNewPolicyMap(data);

                return request;
            });

            const statusChange = await Promise.all(promises);

            reload();

            showSuccessModal('Succes!', 'You have successfully added a Policy');
        } catch (e) {
            console.error(e);
            dispatch(setFlashNotification({
                message: e.message,
                isError: false
            }));
        }
    };

    const onEditSubmit = async (id, name, type, selectedItems, defaultKeywords) => {
        try {
            var policy = [];

            await updatePolicy({
                id: id,
                internalCode: type.value,
                description: `List of keywords for ${name}`,
                name: name,
                status: 0,
                deleted: 0
            }).then(x => {
                policy = x;
            });

            const policyMapData = await getPolicymapByIdRaw({ policyId: id });
            const policyMapDataDeleted = await getPolicymapByIdRaw({ policyId: id, deleted: true });
            const activeMap = policyMapData.data.data;
            const activeMapDeleted = policyMapDataDeleted.data.data;

            var itemsToDelete = defaultKeywords.filter(a => !selectedItems.some(b => a.id === b.id));
            var itemsToAdd = selectedItems.filter(a => !defaultKeywords.some(b => a.id === b.id));

            console.log(itemsToDelete);
            console.log(itemsToAdd);

            // Delete
            itemsToDelete.map((policyMap) => {
                var map = activeMap.filter(a => a.keywordId == policyMap.id && a.policyId == id)[0];

                policyMap.mapId = map.id;
            });

            var promises = [];

            itemsToDelete.map(item => {
                const data = {
                    id: item.mapId,
                    keywordId: item.id,
                    policyId: id,
                    deleted: 1
                };

                const request = updatePolicyMap(data);

                promises.push(request);
            });

            itemsToAdd.map(item => {
                var map = activeMapDeleted.filter(a => a.keywordId == item.id && a.policyId == id)[0];
                var request = [];

                if (map) {
                    const data = {
                        id: map.id,
                        keywordId: item.id,
                        policyId: id,
                        deleted: 0
                    };

                    request = updatePolicyMap(data);
                } else {
                    const data = {
                        keywordId: item.id,
                        policyId: id
                    };

                    request = postNewPolicyMap(data);
                }

                promises.push(request);
            });

            const statusChange = await Promise.all(promises);

            reload();

            showSuccessModal('Success!', 'You have successfully edited a Policy');
        } catch (e) {
            console.error(e);
        }
    };

    const onCreateKeyWord = async (keyword) => {
        try {
            await postNewKeyword({ word: keyword });

            // Reload Keywords
            const keywords = await getKeywordSearch();

            dispatch(setKeywords(keywords));

            dispatch(setFlashNotification({
                message: 'Added a new Keyword.',
                isError: false
            }));
        } catch (e) {
            console.error(e);
        }
    };

    const onDeletePolicy = async (policyData) => {
        try {
            var policy = [];

            await getPolicyMapByIdRaw(policyData.id).then(x => {
                policy = x;
            });

            if (policy.status === 200) {
                const { data } = policy.data;

                await updatePolicy({
                    id: policyData.id,
                    name: policyData.name,
                    description: `List of keywords for ${policyData.name}`,
                    internalCode: policyData.internalCode,
                    status: policyData.status,
                    deleted: 1
                });

                const promises = data.map(item => {
                    const data = {
                        id: item.id,
                        keywordId: item.keywordId,
                        policyId: policyData.id,
                        deleted: 1
                    };

                    const request = updatePolicyMap(data);

                    return request;
                });

                const statusChange = await Promise.all(promises);

                reload();

                showSuccessModal('Delete Success!', 'You have successfully deleted a Policy');
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Modals
    const showPolicyCreateModal = () => {
        dispatch(setModalContent({
            modalContent: <CreateModal
                onSubmit={onCreateSubmit}
                onCreateKeyWord={onCreateKeyWord}
                handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyEditModal = async (policy) => {
        const policyMapData = await getPolicymapByIdRaw({ policyId: policy.id });
        const keywords = await getKeywordSearch();
        const { data } = policyMapData.data;

        var defaultSelectedItem = [];

        data.map((policyMap) => {
            var keyword = keywords.filter(a => a.id == policyMap.keywordId)[0];

            defaultSelectedItem.push({
                id: keyword.id,
                label: keyword.label
            });
        });

        dispatch(setModalContent({
            modalContent: <EditModal
                onSubmit={onEditSubmit}
                onCreateKeyWord={onCreateKeyWord}
                handleCloseModal={handleCloseModal}
                defaultPolicy={policy}
                defaultKeywords={defaultSelectedItem}/>,
            size: 'lg'
        }));
    };

    const showPolicyDeleteModal = (policy) => {
        dispatch(setModalContent({
            modalContent: <DeleteModal
                policyData={policy}
                onDelete={onDeletePolicy}
                handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const showSuccessModal = (title, message) => {
        dispatch(setModalContent({
            modalContent: <SuccessModal title={title} message={message} handleCloseModal={handleCloseModal}/>,
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

    return <ProfilesScreen
        loading={loading}
        breadcrumb={breadcrumb}
        onChange={onChange}
        onSubmit={reload}
        onChange={onChange}
        onSubmit={reload}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showPolicyDeleteModal={showPolicyDeleteModal}
        viewCommunicationPolicyDetails={viewCommunicationPolicyDetails}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showPolicyDeleteModal={showPolicyDeleteModal}
        viewCommunicationPolicyDetails={viewCommunicationPolicyDetails}/>;
}
