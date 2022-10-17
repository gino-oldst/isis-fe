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
import { useEffect, useState } from 'react';
import { ImCross, ImPlus } from 'react-icons/im';
import { setPolicyForm } from '../../redux/modules/policies';

// Create Modal
const CreateModal = ({
    loadPolicies,
    onSubmit,
    onCreateKeyWord,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);

    const [newKeyword, setNewKeyword] = useState('');

    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);

    const [showBox, setShowBox] = useState(false);

    const handleAddWords = () => {
        setShowBox(!showBox);
    };

    const handleAddKeywords = () => {
        onCreateKeyWord(newKeyword);
        setNewKeyword('');
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
                            <Input name='categoryName' type='text' defaultValue=''
                                onChange={(x) => setCategoryName(x.target.value)} className='shadow-none isis-control' placeholder='Enter Category Name'/>
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <Label for='categoryType'>Type</Label>
                            <Select
                                name='categoryType'
                                className='w-100'
                                isDisabled={false}
                                isSearchable={false}
                                onChange={(x) => setCategoryType(x)}
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
                                        onChange={(x) => setNewKeyword(x.target.value)}
                                        // defaultValue={filterSearchForm.filterId}
                                        className='shadow-none isis-control'
                                        placeholder='Enter Alert Word'/>
                                </FormGroup>
                                <Button weight='light' label='Add' className='w-100'
                                    disabled={newKeyword == ''} onClick={e => handleAddKeywords()}/>
                            </div>
                        </FormGroup>
                        <FormGroup className='mb-3'>
                            <MultiSelect
                                items={keywords}
                                name='selectedKeywords'
                                onChange={setSelectedItems}/>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Create' variant='primary' className='policies__save-button px-4 py-2'
                    disabled={categoryName == '' && categoryType && selectedItems}
                    onClick={e => onSubmit(categoryName, categoryType, selectedItems)}/>
            </div>
        </div>
    );
};

// Edit Modal
const EditModal = ({
    onSubmit,
    onCreateKeyWord,
    defaultPolicy,
    defaultKeywords,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);

    const [newKeyword, setNewKeyword] = useState('');

    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);

    const [showBox, setShowBox] = useState(false);

    const handleAddWords = () => {
        setShowBox(!showBox);
    };

    const handleAddKeywords = () => {
        onCreateKeyWord(newKeyword);
        setNewKeyword('');
    };

    useEffect(() => {
        setCategoryName(defaultPolicy.name);
        setCategoryType({ label: 'Inappropriate language', value: 'INAPPROPRIATE_LANGUAGE' });
        setSelectedItems(defaultKeywords);
    }, []);

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
                        {/* <p>{JSON.stringify(defaultPolicy)}</p>
                        <p>{JSON.stringify(selectedItems)}</p>
                        <p>{JSON.stringify(defaultKeywords)}</p> */}
                        <p>{JSON.stringify(categoryName == '' && categoryType && selectedItems)}</p>
                        <FormGroup className='mb-3'>
                            <Label for='categoryName'>Category Name</Label>
                            <Input name='filterText' type='text' defaultValue=''
                                className='shadow-none isis-control' placeholder='Search a Keyword'
                                onChange={(x) => setCategoryName(x.target.value)}
                                defaultValue={defaultPolicy.name}/>
                        </FormGroup>
                        <FormGroup className='mb-4'>
                            <Label for='type'>Type</Label>
                            <Select
                                name='type'
                                className='w-100'
                                isDisabled={false}
                                isSearchable={false}
                                defaultValue={{ label: 'Inappropriate language', value: 'INAPPROPRIATE_LANGUAGE' }}
                                onChange={(x) => setCategoryType(x)}
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
                                        onChange={(x) => setNewKeyword(x.target.value)}
                                        defaultValue={defaultPolicy.name}
                                        className='shadow-none isis-control'
                                        placeholder='Enter Alert Word'/>
                                </FormGroup>
                                <Button weight='light' label='Add' className='w-100'
                                    disabled={newKeyword == ''} onClick={e => handleAddKeywords()}/>
                            </div>
                        </FormGroup>
                        <FormGroup className='mb-3'>
                            <MultiSelect
                                items={keywords}
                                selectedItems={defaultKeywords}
                                name='selectedKeywords'
                                onChange={setSelectedItems}/>
                            {/* selectedItems={[{ id: 3, label: "Item 3" }]}
                            loading={boolean("Loading", false)}
                            onChange={action("onChange")}
                            showSearch={boolean("Show search", true)}
                            showSelectAll={boolean("Show select all", true)} */}
                        </FormGroup>
                    </Col>
                </Row>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Edit' variant='primary' className='policies__save-button px-4 py-2'
                    disabled={categoryName == '' && categoryType && selectedItems}
                    onClick={e => onSubmit(defaultPolicy.id, categoryName, categoryType, selectedItems, defaultKeywords)}/>
            </div>
        </div>
    );
};

// Delete Modal
const DeleteModal = ({
    policyData,
    onDelete,
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
                <Button label='Delete' variant='primary' className='policies__save-button px-4 py-2'
                    onClick={e => onDelete(policyData)}/>
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
                    className='playfair-font text-center mb-4 w-100'>
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
