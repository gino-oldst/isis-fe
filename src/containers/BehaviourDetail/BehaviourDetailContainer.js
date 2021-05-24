// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkAuthorization } from '../../utils/Auth';
import BehaviourDetailScreen from './BehaviourDetailScreen';
import { setSelectedBehaviour, setParametersData } from '../../redux/modules/behaviours';
import { getRules, getParameters } from '../../api/behaviours';

type Props = {
    sidebarMenu: Array<Menu>,
    handleCloseModal: Function
}

export default function BehaviourDetailContainer({
    match,
    sidebarMenu,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { selected } = useSelector(({ behaviours }) => behaviours);

    const breadcrumb = [
        {
            label: 'Home',
            path: '/dashboard'
        },
        {
            label: 'Behaviours',
            path: '/behaviours'
        },
        {
            label: match.params.id,
            path: `/behaviour/${match.params.id}`
        }
    ];

    // check if user is logged in
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const auth = await checkAuthorization();

        if (!auth) history.push('/login');
        else loadBehaviourDetails();
    };

    const loadBehaviourDetails = () => {
        setLoading(true);

        const rules = getRules();

        rules
            .then(res => {
                const parameters = getParameters({
                    behaviourId: selected.id,
                    ruleId: res.data.data[0].id
                });

                parameters
                    .then(res2 => {
                        dispatch(setParametersData(res2.data.data));
                        setLoading(false);
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    };

    return <BehaviourDetailScreen
        loading={loading}
        breadcrumb={breadcrumb}
        tableColumns={selected.columns}
        tableData={selected.data}
        selectedBehaviour={selected}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal} />;
}
