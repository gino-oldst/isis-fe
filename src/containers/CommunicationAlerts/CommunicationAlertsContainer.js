// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import CommunicationAlertsScreen from './CommunicationAlertsScreen';
import type { Menu } from '../../types';
import { getBehaviours } from '../../api/behaviours';
import { getAlerts, downloadAlertsList, getColumnFilterValues } from '../../api/alerts';
import { getUsers } from '../../api/users';
import {
    DATE_TO_UTC
} from '../../utils/helpers';
import { setCommunicationAlertsData, setColumnFilterValues } from '../../redux/modules/communicationAlerts';
import debounce from 'debounce-async';

// To be removed once we move to with backend
import filterSample from './filters.json';
import { getCommunicationAlertData, getKeywords, updateAlert } from '../../api/communicationAlerts';
import { getEmails, getEmailsAll } from '../../api/communicationSearch';
import { set } from 'date-fns';
import Typography from '../../components/base/Typography/Typography';
import Button from '../../components/base/Button/Button';
import { setModalContent } from '../../redux/modules/modalEvent';
import { setAlertsList } from '../../redux/modules/isisTable';

type Props = {
    sidebarMenu: Array<Menu>,
    useMediaQuery: Function,
    handleCloseModal: Function
}

export default function CommunicationAlertsContainer({
    userId,
    sidebarMenu,
    useMediaQuery,
    handleCloseModal
}: Props): React$Element<any> {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { pageSize, activePage, appliedFilters, selectedRows, areRowsSelectedAll, sort, dateRange } = useSelector(({ isisTable }) => isisTable);
    const { table, selected } = useSelector(({ communicationAlerts }) => communicationAlerts);
    const [keywords, setKeywords] = useState([]);
    const [senders, setSenders] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [source, setSource] = useState([]);
    const [alert, setAlert] = useState([]);
    const [status, setStatus] = useState([]);
    const breadcrumb = [
        {
            label: 'Home',
            path: '/communication_alerts'
        },
        {
            label: 'Communication Alerts',
            path: '/communication_alerts'
        }
    ];
    const [filterDate, setFilterDate] = useState([
        {
            startDate: '',
            endDate: ''
        }
    ]);

    const [isTimeout, setIsTimeout] = useState(false);

    const loadCommAlertsData = async (page, size, sort, alert, status, dFrom, dTo, sources, senders, recipients) => {
        setLoading(true);

        try {
            const alerts = await getCommunicationAlertData(page, size, sort, alert, status, dFrom, dTo, sources, senders, recipients);
            const { data, alertIds, totalNoOfRecords, totalPages } = alerts.data;

            console.log(alerts);

            dispatch(setCommunicationAlertsData(data, alertIds, totalNoOfRecords, totalPages));
        } catch (e) {
            if (e.status == 500 || status == 408) {
                setIsTimeout(true);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        loadColumnFilterValues();
    }, []);

    useEffect(() => {
        // const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DD hh:mm A') : ''; // for adding time in format hh:mm A
        // const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DD hh:mm A') : ''; // for adding time in format hh:mm A

        const dateFrom = filterDate[0].startDate != '' ? moment(filterDate[0].startDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';
        const dateTo = filterDate[0].endDate != '' ? moment(filterDate[0].endDate).utc().local().format('YYYY-MM-DDTHH:mm:ss') : '';

        setDateFrom(dateFrom);
        setDateTo(dateTo);
    }, [filterDate]);

    useEffect(() => {
        loadCommAlertsData(
            activePage,
            pageSize,
            sort,
            alert,
            status,
            dateFrom,
            dateTo,
            source,
            senders,
            recipients
        );
    }, [pageSize, activePage, sort]);

    const loadColumnFilterValues = async () => {
        // const emails = await getEmails();
        const keywords = await getKeywords();

        dispatch(setAlertsList(keywords));
        setKeywords(keywords);
        // const { data } = emails.data;

        // const emailList = data.map((account) => ({
        //     value: account.email,
        //     label: `${account.email} (${account.firstName} ${account.lastName})`
        // }));

        // const dataCopy = {
        //     emails: emailList,
        //     keywords: keywords
        // };

        // console.log(dataCopy);

        // dispatch(setColumnFilterValues(dataCopy));
    };

    const tableIsFiltered = () => {
        return !!appliedFilters.filter(filter => filter.value.length > 0).length;
    };

    const viewCommunicationAlertDetails = async (id, chainLinkId, filterText) => {
        // history.push({
        //     pathname: `/communication_alerts_detail/${id}`,
        //     state: { id: id }
        // });
        history.push({
            pathname: `/communication_alerts_detail/${id}`,
            state: { id: id, chainLinkId: chainLinkId, filterText: filterText }
        });
        // window.location.href = `/communication_alerts_detail/${id}`;
    };

    const showSuccessModal = () => {
        dispatch(setModalContent({
            modalContent: <SuccessModal handleCloseModal={handleCloseModal}/>,
            size: 'md'
        }));
    };

    const [submit, setSubmit] = useState(false);

    const onSubmitStatusChange = async (status, note, selectedRows) => {
        setSubmit(true);

        try {
            const promises = selectedRows.map(row => {
                // const messageId = row.message.id;

                row.alerts.data.map(async alert => {
                    const data = {
                        id: alert.id,
                        policyId: alert.policyId,
                        status: status,
                        notes: note
                    };

                    const request = await updateAlert(data);

                    // console.log(request);

                    return request;
                });
            });

            const statusChange = await Promise.all(promises);
            // showSuccessModal();

            // console.log(statusChange);
        } catch (e) {
            console.error(e);
        }

        setSubmit(false);
    };

    const handleSource = (event) => {
        setSource(event);
    };

    const handleAlert = (event) => {
        setAlert(event);
    };

    const handleStatus = (items) => {
        setStatus(items);
    };

    const handleSenderChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setSenders(list);
        // setFilterSearchForm({
        //     ...filterSearchForm,
        //     filterSenders: list
        // });
    };

    const handleRecipientChange = (updatedList) => {
        var list = [];

        updatedList.map(op => {
            list.push(op.value);
        });

        setRecipients(list);
        // setFilterSearchForm({
        //     ...filterSearchForm,
        //     filterRecipients: list
        // });
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

    const onSearchClick = () => {
        // alert, status, dFrom, dTo, sources, senders, recipients
        loadCommAlertsData(
            activePage,
            pageSize,
            sort,
            alert,
            status,
            dateFrom,
            dateTo,
            source,
            senders,
            recipients
        );
        // console.log(senders);
        // console.log(recipients);
        // console.log(dateFrom);
        // console.log(dateTo);
        // console.log(source);
        // console.log(alert);
        // console.log(status);
    };

    return <CommunicationAlertsScreen
        loading={loading}
        isTimeout={isTimeout}
        onSearchClick={onSearchClick}
        userId={userId}
        table={table}
        activePage={activePage}
        useMediaQuery={useMediaQuery}
        breadcrumb={breadcrumb}
        sidebarMenu={sidebarMenu}
        handleCloseModal={handleCloseModal}
        selectedRows={selectedRows}
        submit={submit}
        onSubmit={onSubmitStatusChange}
        viewCommunicationAlertDetails={viewCommunicationAlertDetails}
        keywords={keywords}
        filterDate={filterDate}
        handleRecipientChange={handleRecipientChange}
        handleSenderChange={handleSenderChange}
        handleSource={handleSource}
        handleAlert={handleAlert}
        handleStatus={handleStatus}
        loadOptions={loadOptions}
        setFilterDate={setFilterDate}
        defaultSource={source}
        defaultStatus={status}
        defaultAlert={alert}/>;
}

const SuccessModal = ({
    handleCloseModal
}) => {
    const dispatch = useDispatch();

    return (
        <div className='action-modal p-4'>
            <div className='row action-modal__content mt-5 mb-5 d-flex justify-content-center align-items-center'>
                <Typography variant='size-26' color='color-3'
                    className='playfair-font'>
                    Alert Status Updated
                </Typography>
                <Typography variant='size-16' color='color-3'
                    className='mb-4 playfair-font'>
                    You have successfully bulk reviewed the alerts
                </Typography>
            </div>
            <div className='action-modal__buttons d-flex justify-content-center align-items-center'>
                <Button label='Close' variant='primary' className='cancel-button px-4 mr-2 py-2'
                    onClick={handleCloseModal}/> {/* onClick={handleClose} disabled={submit} /> */}
                {/* <Button label='Apply' isLoading={submit} variant='secondary'
                    className='alerts__save-button px-4 py-2'
                    onClick={handleBulkUpdate} disabled={submit} /> */}
            </div>
        </div>
    );
};
