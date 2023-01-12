// @flow
import React, { useState, useEffect, createRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/base/Table/Table';
import Button from '../../components/base/Button/Button';
import Select from '../../components/base/Select/Select';
import Badge from '../../components/base/Badge/Badge';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import ReactDatePicker from 'react-datepicker';
import Typography from '../../components/base/Typography/Typography';
import Breadcrumbs from '../../components/base/Breadcrumbs/Breadcrumbs';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import withLoading from '../../components/modules/withLoading/withLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaInfoCircle } from 'react-icons/fa';
import CustomDropdown from '../../components/base/CustomDropdown/CustomDropdown';
import filterIcon from '../../assets/images/ic_filter.svg';
import type { Menu } from '../../types';
import {
    setDateRangeLocal,
    getDateRangeLocal,
    isoToUTCLocal,
    truncateText,
    isDisclaimer,
    isDebug,
    sourceMaker,
    isMessageEvent
} from '../../utils/helpers';
import {
    Row,
    Col,
    Card,
    CardBody,
    DropdownItem,
    FormGroup,
    Input,
    Label,
    Alert,
    Spinner
} from 'reactstrap';
import { useIsMount } from '../../hooks/useIsMount';

import './communication-search-message-details.scss';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';
import HtmlToRtfBrowser from 'html-to-rtf-browser';
import { MESSAGE_TYPE } from '../../config/constants';
import { bulkUpdateAlert } from '../../api/alerts';
import { setModalContent } from '../../redux/modules/modalEvent';
import { resetTableState } from '../../redux/modules/table';
import { setLoading, setAlertsDateRange } from '../../redux/modules/alerts';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';
import Highlighter from 'react-highlight-words';
import { Nav, OverlayTrigger, Popover, PopoverContent, Tab } from 'react-bootstrap';
import { Element, Link, scroller, Button as ScrollButton } from 'react-scroll';
import { load } from 'dotenv';
import { customWordHighlightLogic } from '../../utils/highlightHelper';

type Props = {
    loading: Boolean,
    userId: String,
    breadcrumb: Array,
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function,
    handleSelectAll: Function,
    isCheckAll:Boolean,
    handleGenerate:Function,
    isChecked:Boolean,
    onClickCloseModal: Function,
    detailData: Array,
    alertsData: Array,
    dataId: Any,
    loadMessageStatus: String,
    messages: Array,
    recipients: Array,
    filterText: String,
    messageButtonDisable: Any
}

function CommunicationSearchMessageDetailsScreen({
    loading,
    userId,
    breadcrumb,
    useMediaQuery,
    sidebarMenu,
    detailData,
    onClickCloseModal,
    dataId,
    handleCloseModal,
    handleSelectAll,
    isCheckAll,
    alertsData,
    handleGenerate,
    isChecked,
    loadMessageStatus,
    messages,
    recipients,
    filterText,
    messageButtonDisable
}: Props): React$Element<any> {
    const dispatch = useDispatch();
    const { profileData } = useSelector(({ authentication }) => authentication);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1199px)' });
    const isLaptopScreen = useMediaQuery({ query: '(max-width: 1450px)' });
    const history = useHistory();

    const renderAlertInfo = (text) => (
        <Popover id='popover-basic'>
            <PopoverContent>
                <Typography color='color-3' className='mr-auto' weight='bold'
                    style={{ fontSize: '14px', lineHeight: '20pt' }}>Reason for resolution</Typography>
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '14px' }} >{text}</Typography>
            </PopoverContent>
        </Popover>
    );

    const renderRecipientPopover = (text) => (
        <Popover id='popover-basic'>
            <PopoverContent>
                <Typography color='color-3' className='mr-auto' weight='bold'
                    style={{ fontSize: '14px', lineHeight: '20pt' }}>Recipients</Typography>
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '14px' }} >{text}</Typography>
            </PopoverContent>
        </Popover>
    );

    const showActionsModal = () => {
        dispatch(setModalContent({
            modalContent: <ActionModal handleCloseModal={handleCloseModal} />,
            size: 'lg'
        }));
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal} />,
            size: 'md'
        }));
    };

    useEffect(() => {
        // scroll to active message
        scroller.scrollTo(`${dataId}`, {
            duration: 500,
            smooth: true,
            containerId: 'containerElement'
            // offset: 50 // Scrolls to element + 50 pixels down the page
        });
    }, [loading]);

    const ActionModal = ({
        userId,
        activeModal,
        loadAlerts,

        handleCloseModal
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-5'>
                <FontAwesomeIcon className='color-sidebar-2 cursor-pointer float-right' icon='times' size='lg'
                    onClick={handleCloseModal} />
                <Typography color='color-3' className='mr-auto' weight='regular'
                    style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? detailData.source : 'No Source'} {/* Email */}</Typography>
                <div className='d-flex flex-column'>
                    {/* <FormGroup check={true} className='mb-1'>
                            <Label check={true} className='d-flex align-items-center'>
                                <AllCheckerCheckbox/>
                                <span className='box-label'>(Select All)</span>
                            </Label>
                        </FormGroup> */}
                    <CheckboxGroup onChange={handleSelectAll} defaultChecked={isChecked}>
                        <FormGroup className='mb-1'>
                            <Label>
                                <AllCheckerCheckbox />
                                <span>Select All</span>
                            </Label>
                        </FormGroup>
                        <div id='containerElement' className='communication-search-message-details__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                            <div>
                                {messages.map(message => {
                                    return (!isDisclaimer(message.message)
                                        ? <>
                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                {message.showSender &&
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                        style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '10pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography>}
                                                {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '10pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                <div>
                                                    <Checkbox Name='select-option' value = {message.id} style={{ position: 'relative', bottom: '-40px' }}/>
                                                    <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                        <Highlighter highlightClassName='alertKeyword'
                                                            style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                            searchWords={[filterText]}
                                                            autoEscape={true}
                                                            textToHighlight={message.message} />
                                                    </div>
                                                </div>
                                            </Element>
                                        </>
                                        : <>
                                            <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                {message.showSender &&
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                        style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography>}
                                                {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '10pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                <div className='message-box' style={{ padding: '15px 20px', background: '#F6F6F6', borderRadius: '0px 10px 10px 10px' }}>
                                                    <Highlighter highlightClassName='alertKeyword'
                                                        style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                        searchWords={[]}
                                                        autoEscape={true}
                                                        textToHighlight={message.message} />
                                                </div>
                                            </Element>
                                        </>);
                                })}
                            </div>
                        </div>
                    </CheckboxGroup>
                </div>
                <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                    <Button label='Cancel' variant='light' className='cancel-button px-4 mr-2 py-2'
                        onClick={handleCloseModal} />
                    <Button label='Generate' variant='primary' className='alerts-detail__save-button px-4 py-2'
                        onClick={handleGenerate} />
                </div>
            </div>
        );
    };

    const SuccessModal = ({
        userId,
        activeModal,
        loadAlerts,
        handleCloseModal
    }) => {
        const dispatch = useDispatch();

        return (
            <div className='action-modal p-4'>dsas</div>
        );
    };

    return (
        <div className='communication-search-message-details'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='w-100'>
                <Breadcrumbs className='position-sticky' links={breadcrumb} />
                <div className='overflow-auto h-100 pb-40'>
                    <div className='communication-search-message-details__content'>
                        <Card className='px-5 py-4'>
                            <CardBody>
                                <div className='communication-search-message-details__detail-heading d-flex align-items-center'>
                                    <Typography color='color-3' className='alerts__title mr-auto'
                                        weight='regular' style={{ fontSize: '40px !important', lineHeight: '24pt' }}>{dataId != '' ? dataId : 'N/A'}</Typography>
                                </div>
                                <div className='communication-search-message-details__information mt-2'>
                                    <Row>
                                        <Col>
                                            <Typography color='color-3' className='alerts__title mr-auto' weight='regular'
                                                style={{ fontSize: '32px', lineHeight: '24pt' }} >{detailData.subject != null ? detailData.subject : detailData.subject} {/* RE: Trading Message */}</Typography>
                                            <Typography color='color-3' className='mr-auto' weight='regular'
                                                style={{ fontSize: '16px', lineHeight: '24pt' }}>{detailData.source != null ? sourceMaker(detailData.source) : 'No Source'} {/* Email */}</Typography>
                                        </Col>
                                    </Row>
                                    <Row className='mt-5'>
                                        <Col lg={7}>
                                            <div className='mb-4'>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <Typography color='color-3' className='mr-3 mb-2' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '24pt' }}>Alert</Typography>
                                                </div>
                                                <table className='table' style={{ minWidth: '300px !important' }}>
                                                    <table className='table'>
                                                        {alertsData.length > 0
                                                            ? <>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='pb-2' style={{ borderTop: '0px !important' }}>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Alert</Typography>
                                                                        </th>
                                                                        <th className='pb-2' style={{ borderTop: '0px !important' }}>
                                                                            <Typography color='color-3' className='mr-3' weight='semi-bold'>Trigered Text</Typography>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {alertsData.map(alert => {
                                                                        return (<>
                                                                            <tr>
                                                                                <td className='pb-2'>
                                                                                    <Typography color='color-3'>{alert.policyName}</Typography>
                                                                                </td>
                                                                                <td className='pb-2'>
                                                                                    <Typography color='color-3'>{alert.keyword}</Typography>
                                                                                </td>
                                                                            </tr>
                                                                        </>);
                                                                    })}
                                                                </tbody>
                                                            </>
                                                            : <>
                                                                <thead>
                                                                    <tr>
                                                                        <th className='pb-2 text-center'>
                                                                            <Typography size={18} color='color-1' className='mr-3'
                                                                                weight='semi-bold'>No Alerts</Typography>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                            </>
                                                        }
                                                    </table>
                                                </table>
                                            </div>
                                            <div className='pt-30 pb-30 communication-search-message-details__messages'>
                                                <Row>
                                                    <Col>
                                                        <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                            style={{ fontSize: '24px', lineHeight: '24pt' }}>Message</Typography>
                                                        <Typography color='color-3' className='mr-3 mb-4' weight='regular'
                                                            style={{ fontSize: '16px', lineHeight: '24pt' }}>Message is highlighted.</Typography>
                                                    </Col>
                                                    <Link className='btn btn-outline-primary ok-button px-2 mr-2 py-2' to={dataId} smooth={true}
                                                        containerId='containerElement' duration={500}>
                                                        Show Message
                                                    </Link>
                                                    <Link className='btn btn-outline-primary download-button px-2 mr-2 py-2' onClick={showActionsModal} smooth={true}
                                                        containerId='containerElement' duration={500}>
                                                        Download Page
                                                    </Link>
                                                </Row>
                                                {/* || recipients === undefined */}
                                                {loading
                                                    ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                        <span className='sr-only'>Loading...</span>
                                                    </Spinner>
                                                    : <>
                                                        <div className='d-flex flex-column'>
                                                            <div id='containerElement' className='communication-search-message-details__message-thread pr-5 pt-1 pb-5 mb-4 mt-4'>
                                                                <div>
                                                                    {messages.map(message => {
                                                                        return (!isDisclaimer(message.message)
                                                                            ? <>
                                                                                <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                                                    {isMessageEvent(message.message) || message.type === MESSAGE_TYPE.JOIN || message.type === MESSAGE_TYPE.LEAVE
                                                                                        ? <div className='message-box-event'>
                                                                                            <Typography color='color-2' className='mr-3 text-center' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '14px', lineHeight: '24pt' }}>{isoToUTCLocal(message.timeSent)} {message.type != null || !message.source.toLowerCase() == 'bloomberg_chat' && `*** ${message.sender}` } {message.message} </Typography>
                                                                                        </div>
                                                                                        : <>
                                                                                            {/* <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b> {isoToUTCLocal(message.timeSent)}</Typography> */}
                                                                                            {message.showSender &&
                                                                                                <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                                    style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography>}
                                                                                            <div className='message-box'>
                                                                                                <Highlighter highlightClassName='alertKeyword'
                                                                                                    style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                                    searchWords={[filterText]}
                                                                                                    autoEscape={true}
                                                                                                    textToHighlight={message.message}/>
                                                                                                {isDebug()
                                                                                                    ? <Typography color='color-1' className='mr-3 text-right messageID' weight='regular'
                                                                                                        style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}>ID: {message.id} </Typography>
                                                                                                    : ''}
                                                                                            </div>
                                                                                        </>
                                                                                    }
                                                                                </Element>
                                                                            </>
                                                                            : <>
                                                                                <Element name={message.id} className={`element mb-1 ${message.id == dataId && 'active-message'}`}>
                                                                                    {isMessageEvent(message.message) || message.type === MESSAGE_TYPE.JOIN || message.type === MESSAGE_TYPE.LEAVE
                                                                                        ? <div className='message-box-event'>
                                                                                            <Typography color='color-1' className='mr-3 text-center' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '14px', lineHeight: '24pt' }}>{isoToUTCLocal(message.timeSent)} {message.type != null || !message.source.toLowerCase() == 'bloomberg_chat' && `*** ${message.sender}` } {message.message} </Typography>
                                                                                        </div>
                                                                                        : <>{message.showSender &&
                                                                                            <Typography color='color-3' className='mr-3 mb-2' weight='regular'
                                                                                                style={{ backgroundColor: '121212', fontSize: '16px', lineHeight: '24pt' }}><b>{message.sender}</b>{message.showSender} {isoToUTCLocal(message.timeSent)}</Typography>}
                                                                                        <div className='message-box'>
                                                                                            <Highlighter highlightClassName='alertKeyword'
                                                                                                style={{ fontSize: '14px', lineHeight: '20pt', fontWeight: '400' }}
                                                                                                searchWords={[]}
                                                                                                autoEscape={true}
                                                                                                textToHighlight={message.message}/>
                                                                                            {isDebug()
                                                                                                ? <Typography color='color-1' className='mr-3 text-right' weight='regular'
                                                                                                    style={{ backgroundColor: '121212', fontSize: '11px', lineHeight: '24pt' }}> ID: {message.id} </Typography>
                                                                                                : ''}
                                                                                        </div>
                                                                                        </>
                                                                                    }
                                                                                </Element>
                                                                            </>);
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </Col>
                                        <Col className='offset-lg-1' lg={4} md={12}>
                                            <div style={{ border: '2px solid #D0D0D0', padding: '30px' }}>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Date & Time: </b>{detailData.timeSent != null ? isoToUTCLocal(detailData.timeSent) : 'N/A'} {/* 17/12/20 5:34 PM */}</Typography>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} ><b>Sender: </b>{detailData.sender != null ? detailData.sender : 'N/A'} {/* daniel.caplin@marianacap.com */}</Typography>
                                                <Typography color='color-3' className='mr-auto' weight='regular'
                                                    style={{ fontSize: '16px', lineHeight: '24pt' }} >
                                                    <b>Recipient: </b>
                                                    {loading || recipients === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : recipients != null
                                                            ? recipients
                                                            : 'N/A'
                                                    }
                                                </Typography>
                                            </div>
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col lg={4} className='mt-5 mb-4'>
                                            <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                style={{ fontSize: '24px', lineHeight: '32pt' }}>Comment</Typography>
                                            <Input type='textarea' name='alertComment' id='alertComment'
                                                className='mb-2' rows={4} placeholder='Comment here...' />
                                            <Button label='Add Comment' variant='primary' className='ok-button px-4 mt-3 mr-2 py-2' />
                                        </Col>
                                    </Row> */}
                                    {/* <Row>
                                        <Col lg={6} className='mt-5 mb-4 pt-30'>
                                            <Tab.Container id='left-tabs-example' defaultActiveKey='link-0'>
                                                <div className='alert-detail__activities'>
                                                    <Typography color='color-3' className='mr-3' weight='semi-bold'
                                                        style={{ fontSize: '24px', lineHeight: '32pt' }}>Activity</Typography>
                                                    <Nav className='navActivities mb-4' variant='pills' defaultActiveKey='/home'>
                                                        <Nav.Item>
                                                            <Nav.Link disabled={true}>Show</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-0'>ALL</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-1'>MESSAGE ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey='link-2'>ALERT ACTIVITIES</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                    <div className='overflow-auto pr-2'>
                                                        <div key={1} className='alert-detail__activity-info d-flex align-items-center mb-4'>
                                                            <span className='activity-icon'><span className='text-light'>J</span></span>
                                                            <div className='d-block'>
                                                                <Typography color='color-3' variant='size-16'>James Allan added a comment.</Typography>
                                                                <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:12 AM</Typography>
                                                                <Typography color='color-3 mt-2' variant='size-14' >Donec rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. </Typography>
                                                            </div>
                                                        </div>
                                                        <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                            <span className='activity-icon'><span className='text-light'>J</span></span>
                                                            <div className='d-block'>
                                                                <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                            </div>
                                                        </div>
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey='link-0'>
                                                                <div key={1} className='alert-detail__activity-info d-flex align-items-center mb-4'>
                                                                    <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                    <div className='d-block'>
                                                                        <Typography color='color-3' variant='size-16'>James Allan added a comment.</Typography>
                                                                        <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:12 AM</Typography>
                                                                        <Typography color='color-3 mt-2' variant='size-14' >Donec rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. </Typography>
                                                                    </div>
                                                                </div>
                                                                <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                    <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                    <div className='d-block'>
                                                                        <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                        <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                    </div>
                                                                </div>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey='link-1'>
                                                                <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                    <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                    <div className='d-block'>
                                                                        <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                        <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                    </div>
                                                                </div>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey='link-2'>
                                                                <div key={2} className='alert-detail__activity-info d-flex align-items-center'>
                                                                    <span className='activity-icon'><span className='text-light'>J</span></span>
                                                                    <div className='d-block'>
                                                                        <Typography color='color-3' variant='size-16'>James Allan viewed the alert.</Typography>
                                                                        <Typography color='color-3' variant='size-14' className='text-muted'>17/12/21, 8:02 AM</Typography>
                                                                    </div>
                                                                </div>
                                                            </Tab.Pane>
                                                        </Tab.Content>
                                                    </div>
                                                </div>
                                            </Tab.Container>
                                        </Col>
                                    </Row> */}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommunicationSearchMessageDetails: any = withLoading <React$Element<Props>>(CommunicationSearchMessageDetailsScreen);

export default CommunicationSearchMessageDetails;
