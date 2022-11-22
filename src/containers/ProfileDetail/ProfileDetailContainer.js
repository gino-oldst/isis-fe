import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setKeywords, setPoliciesData } from '../../redux/modules/policies';
import type { Menu } from '../../types';

import { deletePolicy, deletePolicyMap, getAlertPoliciesData, getAlertPolicyDataByID, getKeywordSearch, getKeywordSearchNumbered, getPolicymapById, getPolicymapByIdRaw, getPolicyMapByIdRaw, getPolicySearchData, postNewKeyword, postNewPolicy, postNewPolicyMap, updatePolicy, updatePolicyMap } from '../../api/policies';
import { getProfileDataByID, deleteUserProfile } from '../../api/profiles';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal, SuccessModal } from './modals';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import ProfileDetailScreen from './ProfileDetailScreen';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function ProfileDetailContainer({
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
    const [policyData, setPolicyData] = useState([]);
    const [profileData, setProfileData] = useState([]);

    const { table } = useSelector(({ policiesDetail }) => policiesDetail);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Profiles',
            path: '/profiles'
        },
        {
            label: filters.state.id,
            path: `profile_detail/${filters.state.id}`,
            disabled: true
        }
    ];

    const { pageSize, activePage, sort } = useSelector(({ table }) => table);

    useEffect(() => {
        loadProfileData(activePage, pageSize, sort);
    }, [pageSize, activePage, sort]);

    const loadProfileData = async (activePage, pageSize, sort) => {
        setLoading(true);

        try {
            const profileData = await getProfileDataByID(filters.state.id);

            setProfileData(profileData);
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const reload = () => {
        loadProfileData(activePage, pageSize, sort);
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

    const onDeleteProfile = async (profileData) => {
        try {
            // TODO: Update delete of policy to update delete -> 1
            var profile = [];

            await getProfileDataByID(filters.state.id).then(x => {
                profile = x;
            });

            const { data } = profile;

            await deleteUserProfile(filters.state.id);

            console.log(data);

            reload();

            showSuccessModal('Delete Success!', 'You have successfully deleted Profile');
        } catch (e) {
            console.error(e);
        }
    };

    // Modals
    const showPolicyEditModal = async (policy) => {
        // TODO: Filter by id to get specific keywords
        const policyMapData = await getPolicymapByIdRaw({ policyId: policyData.id });
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
                defaultPolicy={policyData}
                defaultKeywords={defaultSelectedItem}/>,
            size: 'lg'
        }));
    };

    const showProfileDeleteModal = (profile) => {
        // TODO: Passing of the ID of the Category
        dispatch(setModalContent({
            modalContent: <DeleteModal
                profileData={profileData}
                onDelete={onDeleteProfile}
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

    return <ProfileDetailScreen
        loading={loading}
        breadcrumb={breadcrumb}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}
        categoryName={categoryName}
        type={type}
        profileData={profileData}
        showProfileDeleteModal = {showProfileDeleteModal}
        showPolicyEditModal={showPolicyEditModal}/>;
}
