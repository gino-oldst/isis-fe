// add modals here
import Typography from '../../components/base/Typography/Typography';
import Button from '../../components/base/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import CommunicationPoliciesContainer from './ProfilesContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from '../../components/base/Select/Select';
import AsyncSelect from 'react-select/async';
import './profiles.scss';
import MultiSelect from '@kenshooui/react-multi-select';
import { useEffect, useState } from 'react';
import { ImCross, ImPlus } from 'react-icons/im';
import { setPolicyForm } from '../../redux/modules/policies';

// Create Modal
const CreateModal = ({
    loadPolicies,
    onSubmit,
    loadOptions,
    onCreateKeyWord,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profileCompanyName, setProfileCompanyName] = useState('');
    const [associatedEmails, setAssociatedEmails] = useState([]);

    const [isInternalPerson, setIsInternalPerson] = useState(false);

    const handleIsInternalPerson = () => {
        setIsInternalPerson(!isInternalPerson);
    };

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op);
        });

        setAssociatedEmails(list);
    };

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal}/>
            <Typography variant='size-30' color='color-3'
                className='ml-3 mb-4 playfair-font text-left'>
                Add a Profile
            </Typography>
            <div className='policies__information mt-5 w-100 mb-4'>
                <div className='modal-body'>
                    <Row>
                        <Col lg={12} sm={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>First Name</Label>
                                <Input name='categoryName' type='text' defaultValue=''
                                    onChange={(x) => setProfileFirstName(x.target.value)} className='shadow-none isis-control' placeholder='Enter First Name'/>
                            </FormGroup>
                        </Col>
                        <Col lg={12} sm={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>Last Name</Label>
                                <Input name='categoryName' type='text' defaultValue=''
                                    onChange={(x) => setProfileLastName(x.target.value)} className='shadow-none isis-control' placeholder='Enter Last Name'/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>Company Name</Label>
                                <Input name='categoryName' type='text' defaultValue=''
                                    onChange={(x) => setProfileCompanyName(x.target.value)} className='shadow-none isis-control' placeholder='Enter Company Name'/>
                            </FormGroup>
                        </Col>
                        <Col lg={12}>
                            <FormGroup className='mb-4'>
                                <Label for='categoryType'>Associated Email</Label>
                                <AsyncSelect
                                    isMulti={true}
                                    noOptionsMessage={() => 'Email Not Found'}
                                    cacheOptions={true}
                                    loadOptions={loadOptions}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    name='filterSender'
                                    className='filter-select'
                                    onChange={(newTags) => handleSenderChange(newTags)}
                                    placeholder={'Select Email...'}/>
                            </FormGroup>
                        </Col>
                        <Col lg={12}>
                            <FormGroup
                                check={true}
                                inline={true}>
                                <Input type='checkbox' onChange={(x) => handleIsInternalPerson(x.value)}/>
                                <Label check={true}>
                                    Internal person
                                </Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Create' variant='primary' className='policies__save-button px-4 py-2'
                    disabled={profileFirstName == '' && profileLastName == '' && profileCompanyName == '' && associatedEmails}
                    onClick={e => onSubmit(profileFirstName, profileLastName, profileCompanyName, isInternalPerson, associatedEmails)}/>
            </div>
        </div>
    );
};

// Edit Modal
const EditModal = ({
    defaultProfile,
    onSubmit,
    loadOptions,
    handleCloseModal
}) => {
    const dispatch = useDispatch();
    const { keywords } = useSelector(({ policies }) => policies);
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profileCompanyName, setProfileCompanyName] = useState('');
    const [associatedEmails, setAssociatedEmails] = useState([]);

    const [isInternalPerson, setIsInternalPerson] = useState(false);

    const handleIsInternalPerson = () => {
        setIsInternalPerson(!isInternalPerson);
    };

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op);
        });

        setAssociatedEmails(list);
    };

    useEffect(() => {
        setProfileFirstName(defaultProfile.firstName);
        setProfileLastName(defaultProfile.lastName);
        setProfileCompanyName(defaultProfile.company);
        setIsInternalPerson(defaultProfile.internal);
        setAssociatedEmails(defaultProfile.userLinkIdentifierDtos);
    }, []);

    return (
        <div className='action-modal p-4'>
            <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                onClick={handleCloseModal}/>
            <Typography variant='size-30' color='color-3'
                className='ml-3 mb-4 playfair-font text-left'>
                Edit a Profile
            </Typography>
            <div className='policies__information mt-5 w-100 mb-4'>
                <div className='modal-body'>
                    <Row>
                        <Col lg={12} sm={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>First Name</Label>
                                <Input name='categoryName' type='text' defaultValue={defaultProfile.firstName}
                                    onChange={(x) => setProfileFirstName(x.target.value)} className='shadow-none isis-control' placeholder='Enter First Name'/>
                            </FormGroup>
                        </Col>
                        <Col lg={12} sm={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>Last Name</Label>
                                <Input name='categoryName' type='text' defaultValue={defaultProfile.lastName}
                                    onChange={(x) => setProfileLastName(x.target.value)} className='shadow-none isis-control' placeholder='Enter Last Name'/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <FormGroup className='mb-3'>
                                <Label for='categoryName'>Company Name</Label>
                                <Input name='categoryName' type='text' defaultValue={defaultProfile.company}
                                    onChange={(x) => setProfileCompanyName(x.target.value)} className='shadow-none isis-control' placeholder='Enter Company Name'/>
                            </FormGroup>
                        </Col>
                        <Col lg={12}>
                            <FormGroup className='mb-4'>
                                <Label for='categoryType'>Associated Email</Label>
                                <AsyncSelect
                                    isMulti={true}
                                    noOptionsMessage={() => 'Email Not Found'}
                                    cacheOptions={true}
                                    loadOptions={loadOptions}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    name='filterSender'
                                    className='filter-select'
                                    onChange={(newTags) => handleSenderChange(newTags)}
                                    defaultValue={defaultProfile.userLinkIdentifierDtos.length > 0
                                        ? defaultProfile.userLinkIdentifierDtos.map(row => ({ label: row.identifier, value: row.identifier }))
                                        : []}
                                    placeholder={'Select Email...'}/>
                            </FormGroup>
                        </Col>
                        <Col lg={12}>
                            <FormGroup
                                check={true}
                                inline={true}>
                                <Input type='checkbox' defaultChecked={defaultProfile.internal} onChange={(x) => handleIsInternalPerson(x.value)}/>
                                <Label check={true}>
                                    Internal person
                                </Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal} /> {/* onClick={handleClose} disabled={submit} /> */}
                <Button label='Edit' variant='primary' className='policies__save-button px-4 py-2'
                    disabled={profileFirstName == '' || profileLastName == '' || profileCompanyName == ''}
                    onClick={e => onSubmit(defaultProfile.id, profileFirstName, profileLastName, profileCompanyName, isInternalPerson, associatedEmails)}/>
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
