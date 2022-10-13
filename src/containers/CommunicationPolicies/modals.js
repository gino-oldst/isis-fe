// add modals here
import Typography from '../../components/base/Typography/Typography';
import Button from '../../components/base/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import CommunicationPoliciesContainer from './PoliciesContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from '../../components/base/Select/Select';
import './policies.scss';
import MultiSelect from '@kenshooui/react-multi-select';
import { useState } from 'react';
import { ImCross, ImPlus } from 'react-icons/im';

// Create Modal
const CreateModal = ({
    loadPolicies,
    handleCloseModal,
    onChange
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);

    const [selectedItems, setSelectedItems] = useState([]);
    const [showBox, setShowBox] = useState(false);

    const handleAddWords = () => {
        setShowBox(!showBox);
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal}/>
            <Typography variant='size-30' color='color-3'
                className='mb-4 playfair-font text-center'>
                Add a Category
            </Typography>
            <div className='policies__information mt-5 w-100 mb-4'>
                <Row className='modal-body'>
                    <Col>
                        <FormGroup className='mb-3'>
                            <Label for='categoryName'>Category Name</Label>
                            <Input name='filterText' type='text' defaultValue=''
                                className='shadow-none isis-control' placeholder='Enter Category Name'/>
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <Label for='type'>Type</Label>
                            <Select
                                name='type'
                                className='w-100'
                                isDisabled={false}
                                isSearchable={false}
                                placeholder={'Select Type...'}
                                options={[{
                                    label: 'Inappropriate language',
                                    value: 'INAPPROPRIATE_LANGUAGE'
                                }]}/>
                        </FormGroup>
                        <FormGroup className='mb-3 '>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                <Label for='type' className='mb-0'>Manage Policy Words</Label>
                                <Button variant={`${showBox ? 'danger' : 'primary'}`} weight='light'
                                    iconRight={showBox ? ImCross : ImPlus}
                                    label={`${showBox ? 'Cancel' : 'Add Word'}`}
                                    onClick={handleAddWords}/>
                            </div>
                            <div className={`policy-word-box ${showBox ? '' : 'hidden'}`}>
                                <FormGroup className='mb-2'>
                                    <Label for='policy-word'>Alert Word</Label>
                                    <Input name='policy-word'
                                        type='text'
                                        // onChange={onChange}
                                        // defaultValue={filterSearchForm.filterId}
                                        className='shadow-none isis-control'
                                        placeholder='Enter Alert Word'/>
                                </FormGroup>
                                <Button weight='light' label='Add' className='w-100'/>
                            </div>
                        </FormGroup>
                        <FormGroup className='mb-3'>
                            <MultiSelect
                                items={keywords}
                                onChange={onChange}/>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Apply' variant='primary' className='policies__save-button px-4 py-2'/>
                {/* onClick={e => onSubmit(selectedStatus, resolvedNote, alertsData)}/> */}
                {/* <Button label='Apply' isLoading={submit} variant='secondary'
                    className='policies__save-button px-4 py-2'
                    onClick={handleBulkUpdate} disabled={submit} /> */}
            </div>
        </div>
    );
};

// Edit Modal
const EditModal = ({
    userId,
    activeModal,
    loadAlerts,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showBox, setShowBox] = useState(false);

    const handleAddWords = () => {
        setShowBox(!showBox);
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal}/>
            <Typography variant='size-30' color='color-3'
                className='mb-4 playfair-font text-center'>
                Edit Category
            </Typography>
            <div className='policies__information mt-5 w-100 mb-4'>
                <Row className='modal-body'>
                    <Col>
                        <FormGroup className='mb-3'>
                            <Label for='categoryName'>Category Name</Label>
                            <Input name='filterText' type='text' defaultValue=''
                                className='shadow-none isis-control' placeholder='Search a Keyword'/>
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <Label for='type'>Type</Label>
                            <Select
                                name='type'
                                className='w-100'
                                isDisabled={false}
                                isSearchable={false}
                                options={[{
                                    label: 'Inappropriate language',
                                    value: 'INAPPROPRIATE_LANGUAGE'
                                }]}/>
                        </FormGroup>
                        <FormGroup className='mb-3 '>
                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                <Label for='type' className='mb-0'>Manage Policy Words</Label>
                                <Button variant={`${showBox ? 'danger' : 'primary'}`} weight='light'
                                    iconRight={showBox ? ImCross : ImPlus}
                                    label={`${showBox ? 'Cancel' : 'Add Word'}`}
                                    onClick={handleAddWords}/>
                            </div>
                            <div className={`policy-word-box ${showBox ? '' : 'hidden'}`}>
                                <FormGroup className='mb-2'>
                                    <Label for='policy-word'>Enter Alert Word</Label>
                                    <Input name='policy-word'
                                        type='text'
                                        // onChange={onChange}
                                        // defaultValue={filterSearchForm.filterId}
                                        className='shadow-none isis-cntrol'
                                        placeholder='Enter Alert Word'/>
                                </FormGroup>
                                <Button weight='light' label='Add' className='w-100'/>
                            </div>
                        </FormGroup>
                        <FormGroup className='mb-3'>
                            <MultiSelect
                                items={keywords}
                                selectedItems={selectedItems}/>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Apply' variant='primary' className='policies__save-button px-4 py-2'/>
                {/* onClick={e => onSubmit(selectedStatus, resolvedNote, alertsData)}/> */}
                {/* <Button label='Apply' isLoading={submit} variant='secondary'
                    className='policies__save-button px-4 py-2'
                    onClick={handleBulkUpdate} disabled={submit} /> */}
            </div>
        </div>
    );
};

// Delete Modal
const DeleteModal = ({
    userId,
    activeModal,
    loadAlerts,
    handleCloseModal
}) => {
    const dispatch = useDispatch();

    return (
        <div className='action-modal p-4'>
            <div className='row action-modal__content mt-5 mb-4 d-flex justify-content-center align-items-center'>
                <Typography variant='size-35' color='color-3'
                    className='playfair-font mb-4'>
                    Delete Category?
                </Typography>
                <Typography variant='size-16' color='color-3'
                    className='mb-3 text-center'>
                    Once deleted all the words that is included in this category will not be included in the alert processing.
                </Typography>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
            </div>
        </div>
    );
};

// Success Modal
const SuccessModal = ({
    userId,
    activeModal,
    loadAlerts,
    title,
    message,
    handleCloseModal
}) => {
    const dispatch = useDispatch();

    return (
        <div className='action-modal p-4'>
            <div className='row action-modal__content mt-5 mb-4 d-flex justify-content-center align-items-center'>
                <Typography variant='size-35' color='color-3'
                    className='playfair-font mb-4'>
                    {title}
                </Typography>
                <Typography variant='size-16' color='color-3'
                    className='mb-3 text-center'>
                    {message}
                </Typography>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
            </div>
        </div>
    );
};

export {
    CreateModal, EditModal, DeleteModal, SuccessModal
};
