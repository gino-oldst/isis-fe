import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import type { Menu } from '../../types';

import { getProfileDataByID, deleteUserProfile, updateProfile } from '../../api/profiles';
import { getAlertCategoryName } from '../../utils/helpers';
import { CreateModal, DeleteModal, EditModal, SuccessModal } from '../../containers/Profiles/modals';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setFlashNotification } from '../../redux/modules/flashNotification';
import ProfileDetailScreen from './ProfileDetailScreen';
import debounce from 'debounce-async';
import { getEmails } from '../../api/communicationSearch';

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
    const [profileData, setProfileData] = useState([]);
    const { table, form, keywords } = useSelector(({ profiles }) => profiles);
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

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
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
        loadProfileData();
    };

    const reloadTables = () => {
        history.push('/profiles');
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
            var message = '';

            if (e.exception == 'AlreadyAssignedException') {
                var msg = e.message;
                var matches = msg.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
                var email = msg.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);

                userId = matches[0];
                var user = table.data.filter(a => a.id == userId)[0];

                message = `Email ${email} is already assigned to user ${user.firstName} ${user.lastName}`;
            } else {
                message = e.message;
            }

            dispatch(setFlashNotification({
                message: message,
                isError: false
            }));
            console.error(e);
        }
    };

    const onDeleteProfile = async (profileData) => {
        try {
            var profile = [];

            await getProfileDataByID(filters.state.id).then(x => {
                profile = x;
            });

            const { data } = profile;

            await deleteUserProfile(filters.state.id);

            reloadTables();

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
    const showProfileDeleteModal = (profile) => {
        dispatch(setModalContent({
            modalContent: <DeleteModal
                profileData={profileData}
                onDelete={onDeleteProfile}
                handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const showProfileEditModal = async (profile) => {
        dispatch(setModalContent({
            modalContent: <EditModal
                onSubmit={onEditSubmit}
                loadOptions={loadOptions}
                defaultProfile={profileData}
                handleCloseModal={handleCloseModal}/>,
            size: 'lg'
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
        sidebarMenu={sidebarMenu}
        categoryName={categoryName}
        type={type}
        profileData={profileData}
        showProfileDeleteModal = {showProfileDeleteModal}
        showProfileEditModal={showProfileEditModal}/>;
}
