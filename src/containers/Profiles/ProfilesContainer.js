import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setKeywords, setPolicyForm, setProfilesData } from '../../redux/modules/profiles';
import ProfilesScreen from './ProfilesScreen';
import type { Menu } from '../../types';
import { deletePolicyMap, getAlertPoliciesData, deletePolicy, getKeywordSearch, getPolicymapById, getPolicymapByIdRaw, getPolicyMapByIdRaw, getPolicySearchData, postNewKeyword, postNewPolicy, postNewPolicyMap, updatePolicy, updatePolicyMap, postNewProfile, getProfileData, updateProfile, deleteUserProfile } from '../../api/profiles';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal, SuccessModal } from './modals';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import debounce from 'debounce-async';
import { getEmails } from '../../api/communicationSearch';

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
        loadProfileData(activePage, pageSize, sort, searchData);
    }, [pageSize, activePage, sort]);

    const loadProfileData = async (activePage, pageSize, sort, searchName) => {
        setLoading(true);

        try {
            const profiles = await getProfileData(activePage, pageSize, sort, searchName);
            const { data, totalNoOfRecords, totalPages } = profiles.data;

            dispatch(setProfilesData(data, totalNoOfRecords, totalPages));
            // dispatch(setKeywords(keywords));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    const viewPolicyDetails = async row => {
        history.push(`/policies/${row.original.id}`);
    };

    const reload = () => {
        loadProfileData(activePage, pageSize, sort, searchData);
    };

    const onChange = e => {
        const { value } = e.target;

        setSearchData(value);
    };

    // Handlers
    const onCreateSubmit = async (firstName, lastName, companyName, isInternal, selectedEmails) => {
        try {
            await postNewProfile({
                firstName: firstName,
                lastName: lastName,
                company: companyName,
                internal: isInternal,
                identifiers: [...new Set(selectedEmails
                    ? selectedEmails.map(item => item.value)
                    : '')]
            });

            reload();

            showSuccessModal('Success!', 'You have successfully added a new Profile');
        } catch (e) {
            var message = '';

            if (e.exception == 'AlreadyAssignedException') {
                var msg = e.message;
                var matches = msg.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
                var email = msg.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);

                userId = matches[0];
                var user = table.data.filter(a => a.id == userId)[0];

                message = `Identifier ${email} is already assigned to user ${user.firstName} ${user.lastName}`;
            } else {
                message = e.message;
            }

            dispatch(setFlashNotification({
                message: message,
                isError: false
            }));
        }
    };

    const onEditSubmit = async (id, firstName, lastName, companyName, isInternal, selectedEmails) => {
        try {
            await updateProfile({
                id: id,
                firstName: firstName,
                lastName: lastName,
                company: companyName,
                internal: isInternal,
                identifiers: [...new Set(selectedEmails
                    ? selectedEmails.map(item => item.value)
                    : '')]
            });

            reload();

            showSuccessModal('Success!', 'You have successfully edited a Profile');
        } catch (e) {
            console.error(e);
        }
    };

    const onDeleteProfile = async (profileData) => {
        try {
            await deleteUserProfile(profileData.id);

            reload();

            showSuccessModal('Delete Success!', 'You have successfully deleted Profile');
        } catch (e) {
            console.error(e);
        }
    };

    const [lastOptions, setLastOptions] = useState([]);

    const loadOptions = useMemo(() => {
        return debounce(async (inputValue) => {
            const { data } = await getEmails(inputValue, inputValue, inputValue);
            const accounts = data.data;

            const options = accounts.map((account) => ({
                value: account.email,
                label: `${account.email} (${account.firstName} ${account.lastName})`
            }));

            setLastOptions(options);

            return options;
        }, 300);
    }, [setLastOptions]);

    // Modals
    const showPolicyCreateModal = () => {
        dispatch(setModalContent({
            modalContent: <CreateModal
                onSubmit={onCreateSubmit}
                loadOptions={loadOptions}
                handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showPolicyEditModal = async (profile) => {
        dispatch(setModalContent({
            modalContent: <EditModal
                onSubmit={onEditSubmit}
                loadOptions={loadOptions}
                defaultProfile={profile}
                handleCloseModal={handleCloseModal}/>,
            size: 'lg'
        }));
    };

    const showProfileDeleteModal = (profile) => {
        dispatch(setModalContent({
            modalContent: <DeleteModal
                profileData={profile}
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

    // Redirect
    const viewCommunicationPolicyDetails = async (id, name, type) => {
        history.push({
            pathname: `/profile-detail/${id}`,
            state: { id: id, name: name, type: type }
        });
    };

    return <ProfilesScreen
        loading={loading}
        breadcrumb={breadcrumb}
        onChange={onChange}
        onSubmit={reload}
        table={table}
        activePage={activePage}
        sidebarMenu={sidebarMenu}
        showPolicyCreateModal={showPolicyCreateModal}
        showPolicyEditModal={showPolicyEditModal}
        showProfileDeleteModal={showProfileDeleteModal}
        showPolicyEditModal={showPolicyEditModal}
        viewCommunicationPolicyDetails={viewCommunicationPolicyDetails}
        viewCommunicationPolicyDetails={viewCommunicationPolicyDetails}/>;
}
