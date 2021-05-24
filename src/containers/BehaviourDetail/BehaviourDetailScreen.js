// @flow
import React from 'react';
import { useDispatch } from 'react-redux';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Menu } from '../../types';
import {
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    Spinner
} from 'reactstrap';
import './behaviour-detail.scss';

import { setModalContent } from '../../redux/modules/modalEvent';

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
        console.log(rowData);
        dispatch(setModalContent({
            modalContent: <UpdateParameterModal
                rowData={rowData}
                handleCloseModal={handleCloseModal} />
        }));
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
                                <div className='d-flex mt-2'>
                                    <Typography color='color-3' className='mr-3' variant='size-18'
                                        weight='light'>Active</Typography>
                                    <Toggle
                                        icons={false}
                                        checked={selectedBehaviour.status.toLowerCase() === 'active'} />
                                </div>
                            </div>
                            <Typography color='color-3' variant='size-16' className='mb-4'>
                                {selectedBehaviour.identifier}
                            </Typography>
                            {loading
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
    return (
        <div className='behaviour-detail__edit-parameter p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal} />
            <Typography variant='size-26' color='color-3'
                className='mb-4 playfair-font'>
                Update Parameter
            </Typography>
            <FormGroup className='mb-4'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Code</Typography></Label>
                <Input type='text' name='code' bsSize='lg'
                    defaultValue={rowData.name} />
            </FormGroup>
            <FormGroup className='mb-4'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Description</Typography></Label>
                <Input type='text' name='description' bsSize='lg'
                    defaultValue={rowData.description} />
            </FormGroup>
            <FormGroup className='mb-5'>
                <Label for='note'><Typography color='color-3' variant='size-16'>Value</Typography></Label>
                <Input type='text' name='value' bsSize='lg'
                    defaultValue={rowData.value} />
            </FormGroup>
            <div className='behaviour-detail__edit-parameter-buttons d-flex justify-content-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/>
                <Button label='Save' variant='primary' className='save-button px-5 py-2'
                    onClick={handleCloseModal} />
            </div>
        </div>
    );
};
