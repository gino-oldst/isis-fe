// @flow
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkAuthorization } from '../../utils/Auth';
import BehaviourDetailScreen from './BehaviourDetailScreen';
import { setSelectedBehaviour, setParametersData } from '../../redux/modules/behaviours';
import { getRule, getBehaviourByCode } from '../../api/behaviours';
import { getParametersByRuleId } from '../../api/parameters';

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

    const loadBehaviourDetails = async () => {
        setLoading(true);
        const behaviourCode = localStorage.getItem('selectedBehaviourCode');

        try {
            const selectedBehaviour = await getBehaviourByCode(behaviourCode);

            dispatch(setSelectedBehaviour(selectedBehaviour.data));

            const rules = await getRule(selectedBehaviour.data.id);

            localStorage.setItem('ruleId', rules.data.data[0].id);

            const parameters = await getParametersByRuleId(rules.data.data[0].id);

            dispatch(setParametersData(parameters.data.data));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
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
