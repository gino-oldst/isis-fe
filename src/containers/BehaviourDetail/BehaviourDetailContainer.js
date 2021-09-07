// @flow
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    const loadBehaviourDetails = async () => {
        setLoading(true);

        try {
            const selectedBehaviour = await getBehaviourByCode(match.params.id);

            dispatch(setSelectedBehaviour(selectedBehaviour.data));

            const rules = await getRule(selectedBehaviour.data.id);

            localStorage.setItem('ruleId', rules.data.data[0].id);

            const parameters = await getParametersByRuleId(rules.data.data[0].id);
            const { data, totalNoOfRecords, totalPages } = parameters.data;

            dispatch(setParametersData(data, totalNoOfRecords, totalPages));
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    };

    return <BehaviourDetailScreen
        loading={loading}
        breadcrumb={breadcrumb}
        loadBehaviourDetails={loadBehaviourDetails}
        tableColumns={selected.columns}
        tableData={selected.data}
        selectedBehaviour={selected}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal} />;
}
