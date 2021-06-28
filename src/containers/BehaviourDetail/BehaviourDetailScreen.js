// @flow
import React, { useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';
import validator from 'validator';
import 'react-toggle/style.css';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import ReactDatePicker from 'react-datepicker';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { blockInvalidChar } from '../../utils/helpers';
import type { Menu } from '../../types';
import {
    Card,
    CardBody,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    Spinner
} from 'reactstrap';
import './behaviour-detail.scss';

import { setModalContent } from '../../redux/modules/modalEvent';
import { updateParameter } from '../../api/parameters';
import { updateBehaviour, processBehaviourByDate } from '../../api/behaviours';
import { replaceParameterStatus, replaceParametersData } from '../../redux/modules/behaviours';

type Props = {
    loading: Boolean,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    tableColumns: Array,
    tableData: Array,
    selectedBehaviour: Object,
    handleCloseModal: Function
}

function BehaviourDetailScreen({
    loading,
    breadcrumb,
    sidebarMenu,
    tableColumns,
    tableData,
    selectedBehaviour,
    handleCloseModal
}: Props): React$Element<any> {
    const dispatch = useDispatch();

    const showUpdateParameterModal = rowData => {
        dispatch(setModalContent({
            modalContent: <UpdateParameterModal
                rowData={rowData}
                handleCloseModal={handleCloseModal} />
        }));
    };

    const showRunBehavioursModal = () => {
        dispatch(setModalContent({
            modalContent: <RunBehavioursModal
                handleCloseModal={handleCloseModal} />
        }));
    };

    const handleToggleCheck = async (e) => {
        const userId = localStorage.getItem('userId');

        const result = await updateBehaviour({
            id: selectedBehaviour.id,
            code: selectedBehaviour.code,
            currentUserId: userId,
            description: selectedBehaviour.behaviour,
            internalCode: selectedBehaviour.identifier,
            status: e.target.checked ? 'ACTIVE' : 'IN_ACTIVE'
        });

        if (result.data.responseStatus === 'success') dispatch(replaceParameterStatus(result.data.status));
    };

    return (
        <div className='behaviour-detail'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100 overflow-auto'>
                <Breadcrumbs links={breadcrumb} />
                <div className='behaviour-detail__content'>
                    <Card className='px-4 py-2'>
                        <CardBody>
                            <div className='behaviour-detail__header d-flex'>
                                <Typography color='color-3' className='behaviour-detail__title mr-auto'>{selectedBehaviour.behaviour}</Typography>
                                <div className='d-flex align-items-center mt-2'>
                                    <div className='d-flex align-items-center justify-content-end'>
                                        <Button label={<><Typography weight='light' className='my-1 mx-2'>Run Behaviour</Typography></>}
                                            className='ml-4 mr-4 d-flex align-items-center behaviour-detail__download-button' onClick={showRunBehavioursModal} />
                                        <Typography color='color-3' className='mr-3' variant='size-18'
                                            weight='light'>{selectedBehaviour.status}</Typography>
                                        <Toggle
                                            icons={false}
                                            checked={selectedBehaviour.status.toLowerCase() === 'active'}
                                            onChange={handleToggleCheck} />
                                    </div>
                                </div>
                            </div>
                            <Typography color='color-3' variant='size-16' className='mb-4'>
                                {selectedBehaviour.identifier}
                            </Typography>
                            {loading || tableData === undefined
                                ? <Spinner animation='border' role='status' className='d-flex mx-auto my-5 text-center'>
                                    <span className='sr-only'>Loading...</span>
                                </Spinner>
                                : <Table className='behaviours__table'
                                    tableColumns={tableColumns}
                                    tableData={tableData}
                                    pagination={true}
                                    viewDetails={showUpdateParameterModal} />
                            }
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const BehaviourDetail: any = withLoading<React$Element<Props>>(BehaviourDetailScreen);

export default BehaviourDetail;

const UpdateParameterModal = ({
    rowData,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        ...rowData,
        errors: {}
    });

    const handleUpdate = async () => {
        setLoading(true);

        if (handleValidation()) {
            const userId = localStorage.getItem('userId');
            const payload = {
                id: params.id,
                currentUserId: userId,
                ruleId: params.ruleId,
                behaviourId: params.behaviourId,
                description: params.description,
                value: params.value,
                name: params.name,
                dateCreated: rowData.dateCreated
            };

            const result = await updateParameter(payload);

            if (result.data.responseStatus === 'success') {
                setTimeout(() => {
                    dispatch(replaceParametersData(payload));
                    setLoading(false);
                    handleCloseModal();
                }, 1000);
            } else {
                setLoading(false);
                setParams({
                    ...params,
                    errors: {
                        ...params.errors,
                        backendErr: 'Something went wrong. Please try again later.'
                    }
                });
            }
        }
    };

    const handleChange = e => {
        if (params.errors[e.target.name] !== undefined) params.errors[e.target.name] = false; // remove error msg for a specific input

        setParams({
            ...params,
            [e.target.name]: e.target.value
        });
    };

    const handleValidation = () => {
        const errors = {};
        let formIsValid = true;

        if (validator.isEmpty(params.name)) {
            formIsValid = false;
            errors.name = true;
            errors.nameErrMsg = 'Code is required';
        }

        if (validator.isEmpty(params.description)) {
            formIsValid = false;
            errors.description = true;
            errors.descriptionErrMsg = 'Description is required';
        }

        if (validator.isEmpty(params.value)) {
            formIsValid = false;
            errors.value = true;
            errors.valueErrMsg = 'Value is required';
        }

        setParams({
            ...params,
            errors
        });

        return formIsValid;
    };

    return (
        <div className='behaviour-detail__edit-parameter p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Update Parameter
            </Typography>
            <Typography variant='size-14' className={`my-4 playfair-font text-danger ${params.errors.backendErr !== '' ? 'd-block' : 'd-none'}`}>
                {params.errors.backendErr}
            </Typography>
            <FormGroup className='mb-4'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Code</Typography></Label>
                <Input type='text' name='name' bsSize='lg'
                    defaultValue={rowData.name} onChange={handleChange} invalid={params.errors.name} />
                <FormFeedback className={`${params.errors.name ? 'd-block' : 'd-none'}`}>
                    {params.errors.nameErrMsg}
                </FormFeedback>
            </FormGroup>
            <FormGroup className='mb-4'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Description</Typography></Label>
                <Input type='text' name='description' bsSize='lg'
                    defaultValue={rowData.description} onChange={handleChange} invalid={params.errors.description} />
                <FormFeedback className={`${params.errors.description ? 'd-block' : 'd-none'}`}>
                    {params.errors.descriptionErrMsg}
                </FormFeedback>
            </FormGroup>
            <FormGroup className='mb-5'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Value</Typography></Label>
                <Input type='number' name='value' bsSize='lg'
                    defaultValue={rowData.value} onChange={handleChange} onKeyDown={blockInvalidChar}
                    invalid={params.errors.value} />
                <FormFeedback className={`${params.errors.value ? 'd-block' : 'd-none'}`}>
                    {params.errors.valueErrMsg}
                </FormFeedback>
            </FormGroup>
            <div className='behaviour-detail__edit-parameter-buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} disabled={loading} />
                <Button label={!loading ? 'Save' : 'Saving...'} variant='primary' className='save-button px-5 py-2'
                    onClick={handleUpdate} disabled={loading} />
            </div>
        </div>
    );
};

const RunBehavioursModal = ({
    handleCloseModal
}) => {
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());

    const handleDateChange = date => {
        setFromDate(date);
    };

    const runBehaviours = async () => {
        setLoading(true);

        const payload = {
            importDate: moment(fromDate).format('YYYY-MM-DD'),
            internalCode: localStorage.getItem('selectedBehaviourCode')
        };

        const result = await processBehaviourByDate(payload);

        if (result.status === 200) {
            setTimeout(() => {
                handleCloseModal();
            }, 1000);
        }
    };

    return (
        <div className='behaviour-detail__run-behaviours p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Run Behaviour
            </Typography>
            <FormGroup className='my-5 d-flex align-items-center'>
                <Label for='note'><Typography color='color-3' variant='size-16' className='mr-3'>Target Date</Typography></Label>
                <ReactDatePicker
                    selected={fromDate}
                    className='behaviour-detail__date-picker'
                    dateFormat='dd MMM yyyy'
                    onChange={handleDateChange} />
            </FormGroup>
            <div className='behaviour-detail__run-behaviours-buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} disabled={loading} />
                <Button label={!loading ? 'OK' : 'Running...'} variant='primary' className='save-button px-5 py-2'
                    onClick={runBehaviours} disabled={loading} />
            </div>
        </div>
    );
};
