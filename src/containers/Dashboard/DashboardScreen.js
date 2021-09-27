// @flow
import React from 'react';
import moment from 'moment';
import Button from '../../components/base/Button/Button';
import Typography from '../../components/base/Typography/Typography';
import CollapsibleSidebar from '../../components/base/CollapsibleSidebar/CollapsibleSidebarContainer';
import DatePicker from '../../components/base/DatePicker/DatePicker';
import Tooltip from '../../components/base/Tooltip/Tooltip';
import withLoading from '../../components/modules/withLoading/withLoading';
import receivedIcon from '../../assets/images/icon_bell1.svg';
import resolvedIcon from '../../assets/images/icon_bell2.svg';
import type { Menu } from '../../types';
import {
    Row,
    Col,
    Card,
    CardBody,
    Progress,
    Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, Doughnut, Chart } from 'react-chartjs-2';
import {
    doughnutChartOptions
} from '../../utils/charts';
import {
    pluralIdentifier,
    percentageCalculator,
    numberWithCommas
} from '../../utils/helpers';
import './dashboard.scss';

type Props = {
    loading: Boolean,
    sidebarMenu: Array<Menu>,
    fromDate: Date,
    toDate: Date,
    loadDashboardData: Function,
    handleDateChange: Function,
    handleDashboardDownload: Function,
    dashboardData: Object
}

// for dougnut text inside
const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;

Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function() {
        originalDoughnutDraw.apply(this, arguments);

        const chart = this.chart.chart;
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        const fontSize = (height / 140).toFixed(2);

        ctx.font = fontSize + 'em Roboto';
        ctx.textBaseline = 'middle';

        const text = chart.config.data.text;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
    }
});

function DashboardScreen({
    loading,
    sidebarMenu,
    fromDate,
    toDate,
    loadDashboardData,
    handleDateChange,
    handleDashboardDownload,
    dashboardData
}: Props): React$Element<any> {
    const totalAlerts = dashboardData.escalatedToManager + dashboardData.escalatedToCo;
    const totalStatusLevel = [
        dashboardData.alertsOpen,
        dashboardData.alertsInReview,
        dashboardData.alertsResolved,
        dashboardData.alertsArchived
    ].reduce((a, b) => a + b, 0);

    const totalBehaviourTypeNumber = dashboardData.behaviourPerDateSummary && dashboardData.behaviourPerDateSummary.map(({ count }) => count).sort((a, b) => b - a);

    const makeDougnutChartData = () => {
        const data = {
            labels: [`${percentageCalculator(dashboardData.escalatedToManager, totalAlerts)}%`, `${percentageCalculator(dashboardData.escalatedToCo, totalAlerts)}%`],
            datasets: [
                {
                    label: '# of Votes',
                    data: [dashboardData.escalatedToManager, dashboardData.escalatedToCo],
                    backgroundColor: [
                        '#d68b5c',
                        '#3485d5',
                        '#f3f3f3'
                    ],
                    borderWidth: 0
                }
            ],
            text: `${dashboardData.escalatedToCo + dashboardData.escalatedToManager} ALERTS`
        };

        return data;
    };

    const makeLineChartData = () => {
        const data = {
            labels: dashboardData.alertsPerDateSummary.map(stat => moment(stat.alertDate).format('MM/D')),
            datasets: [
                {
                    label: 'Alerts Received',
                    data: dashboardData.alertsPerDateSummary.map(stat => stat.count),
                    borderColor: '#d68b5c',
                    pointBackgroundColor: '#d68b5c',
                    hoverBackgroundColor: '#fff',
                    fill: false,
                    borderWidth: 2,
                    pointRadius: 1,
                    tension: 0
                },
                {
                    label: 'Alerts Resolved',
                    data: dashboardData.alertsPerDateSummary.map(stat => stat.resolvedCount),
                    borderColor: '#9ab87a',
                    pointBackgroundColor: '#9ab87a',
                    hoverBackgroundColor: '#fff',
                    fill: false,
                    borderWidth: 2,
                    pointRadius: 1,
                    tension: 0
                }
            ]
        };

        return data;
    };

    const lineChartOptions = () => {
        return {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: Math.max.apply(null, dashboardData.alertsPerDateSummary.map(stat => stat.count)),
                        min: 0,
                        stepSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'No. of Alerts'
                    }
                }]
            },
            legend: {
                display: false
                // align: 'end',
                // labels: {
                //     boxWidth: 3,
                //     usePointStyle: true
                // }
            }
        };
    };

    return (
        <div className='dashboard'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='dashboard__content w-100 overflow-auto'>
                <div className='dashboard__header d-block d-md-flex align-items-center mb-4'>
                    <Typography color='color-3' className='dashboard__title mr-auto mb-4 mb-md-0'>MAR Alerts Overview</Typography>
                    <Button label={<><FontAwesomeIcon className='mr-3' icon='file-download' size='sm' /><span className='font-weight-light'>Download</span></>}
                        disabled={loading} className='dashboard__download-button' size='lg'
                        onClick={handleDashboardDownload} />
                </div>
                <div>
                    <Row>
                        <Col lg={12} xl={8} className='px-2'>
                            <Card className='p-3'>
                                <CardBody>
                                    <Row className='dashboard__date-range mb-4'>
                                        <Col>
                                            <div className='d-block d-lg-flex align-items-center'>
                                                <Typography color='color-3' variant='size-20' weight='semi-bold'
                                                    className='mr-4'>Date Range</Typography>
                                                <div className='dashboard__date-picker d-flex align-items-center mt-3 mt-lg-0'>
                                                    <DatePicker
                                                        value={fromDate}
                                                        onChange={e => handleDateChange('from', e)} />
                                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                                    <DatePicker
                                                        value={toDate}
                                                        onChange={e => handleDateChange('to', e)} />
                                                    <Button label='Refresh' disabled={loading} className='dashboard__download-button ml-4'
                                                        size='lg' onClick={() => loadDashboardData(fromDate, toDate, true)} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='dashboard__received-alerts py-4'>
                                        <Col lg={12} xl={6}>
                                            <Card>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <img src={receivedIcon} alt='Alerts_Received_Icon' className='mr-4' />
                                                    {loading || dashboardData.alertsReceived === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : <Typography className='mr-3 pb-2 playfair-font' color='color-3' weight='semi-bold'
                                                            variant='size-30'>{numberWithCommas(dashboardData.alertsReceived)}</Typography>}
                                                    <Typography color='color-3' weight='light' variant='size-16'>Alerts Received</Typography>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={12} xl={6}>
                                            <Card className='mt-xl-0 mt-3'>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <img src={resolvedIcon} alt='Alerts_Received_Icon' className='mr-4' />
                                                    {loading || dashboardData.alertsResolved === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center mr-3'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : <Typography className='mr-3 pb-2 playfair-font' color='color-3' weight='semi-bold'
                                                            variant='size-30'>{numberWithCommas(dashboardData.alertsResolved)}</Typography>}
                                                    <Typography color='color-3' weight='light' variant='size-16'>Alerts Resolved</Typography>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__alert-statistics py-4'>
                                                <div className='dashboard__alert-statistics-header d-block d-md-flex align-items-start'>
                                                    <Typography color='color-3' variant='size-22' className='playfair-font mr-auto mb-4'>Alert Statistics</Typography>
                                                    <div className='dashboard__alert-statistics__chart-label d-block d-md-flex mt-2 mb-4 mb-md-0'>
                                                        <div className='dashboard__alert-statistics__received d-flex align-items-center mr-5 mb-2 mb-md-0'>
                                                            <FontAwesomeIcon className='mr-2 pb-1 mt-1' icon='circle' size='xs'
                                                                style={{ color: '#d68b5c' }} />
                                                            <Typography color='color-3' variant='size-12'>Alert Received</Typography>
                                                        </div>
                                                        <div className='dashboard__alert-statistics__resolved d-flex align-items-center'>
                                                            <FontAwesomeIcon className='mr-2 pb-1 mt-1' icon='circle' size='xs'
                                                                style={{ color: '#9ab87a' }} />
                                                            <Typography color='color-3' variant='size-12'>Alert Resolved</Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='dashboard__charts-alert-statistics__chart'>
                                                    {loading || dashboardData.escalatedToCo === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex mx-auto text-center'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : <Line
                                                            data={makeLineChartData}
                                                            height={232}
                                                            options={lineChartOptions()} />
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__escalation-level py-4'>
                                                <Typography color='color-3' variant='size-22' className='playfair-font mb-5'>Escalation Level Changes in Period</Typography>
                                                <div className='dashboard__charts-escalation-level__chart'>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col sm={12} md={4}>
                                                            {loading || dashboardData.escalatedToCo === undefined
                                                                ? <Spinner animation='border' role='status' className='d-flex mx-auto text-center'>
                                                                    <span className='sr-only'>Loading...</span>
                                                                </Spinner>
                                                                : <div className='mb-3 mb-md-0'>
                                                                    <Doughnut
                                                                        data={makeDougnutChartData}
                                                                        height={180}
                                                                        width={50}
                                                                        responsive={true}
                                                                        options={doughnutChartOptions()} />
                                                                </div>
                                                            }
                                                        </Col>
                                                        <Col sm={12} md={4}>
                                                            <div className='dashboard__escalation-level__labels mb-3 mb-md-0'>
                                                                <div className='dashboard__escalation-level__label1 d-flex align-items-end'>
                                                                    <FontAwesomeIcon className='dashboard__escalation-level__label-icon mr-2 mb-2 pb-1' icon='circle' size='xs'
                                                                        style={{ color: '#d68b5c' }} />
                                                                    {loading || dashboardData.escalatedToManager === undefined
                                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                            <span className='sr-only'>Loading...</span>
                                                                        </Spinner>
                                                                        : <Typography color='color-3' variant='size-30'>{percentageCalculator(dashboardData.escalatedToManager, totalAlerts)}%</Typography>
                                                                    }
                                                                </div>
                                                                <div className='dashboard__escalation-level__sublabel1 mt-2'>
                                                                    <Typography color='color-3' variant='size-14' weight='semi-bold'>{dashboardData.escalatedToManager} Alert{pluralIdentifier(dashboardData.escalatedToManager)}</Typography>
                                                                    <Typography color='color-3' variant='size-14' weight='light'>Moved from Base to Manager</Typography>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col sm={12} md={4}>
                                                            <div className='dashboard__escalation-level__labels'>
                                                                <div className='dashboard__escalation-level__label2 d-flex align-items-end'>
                                                                    <FontAwesomeIcon className='dashboard__escalation-level__label-icon mr-2 mb-2 pb-1' icon='circle' size='xs'
                                                                        style={{ color: '#3485d5' }} />
                                                                    {loading || dashboardData.escalatedToCo === undefined
                                                                        ? <Spinner animation='border' role='status' className='d-flex my-auto text-center'>
                                                                            <span className='sr-only'>Loading...</span>
                                                                        </Spinner>
                                                                        : <Typography color='color-3' variant='size-30'>{percentageCalculator(dashboardData.escalatedToCo, totalAlerts)}%</Typography>
                                                                    }
                                                                </div>
                                                                <div className='dashboard__escalation-level__sub-label2 mt-2'>
                                                                    <Typography color='color-3' variant='size-14' weight='semi-bold'>{dashboardData.escalatedToCo} Alert{pluralIdentifier(dashboardData.escalatedToCo)}</Typography>
                                                                    <Typography color='color-3' variant='size-14' weight='light'>Moved from Manager to CO</Typography>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={12} xl={4} className='px-2'>
                            <Card className='mt-xl-0 mt-3 p-3'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__status-level'>
                                                <Typography color='color-3' variant='size-22' className='playfair-font mb-4'>Current Status Level Alerts</Typography>
                                                <div className='dashboard__charts-status-level__chart'>
                                                    {loading || dashboardData.alertsOpen === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex mx-auto text-center'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : dashboardData.alertsOpen < 1 &&
                                                        dashboardData.alertsInReview < 1 &&
                                                        dashboardData.alertsResolved < 1 &&
                                                        dashboardData.alertsArchived < 1
                                                            ? <span>No data</span>
                                                            : <Progress multi={true}>
                                                                <Progress key='progress__open' bar={true} className='bg-open'
                                                                    value={dashboardData.alertsOpen} max={totalStatusLevel}
                                                                    data-tip={true} data-for='status-level__open'>
                                                                    <Typography variant='size-12' weight='light'>Open</Typography>
                                                                </Progress>
                                                                <Tooltip id='status-level__open' place='bottom'>
                                                                    <Typography variant='size-14' weight='semi-bold' color='color-3'>Open</Typography>
                                                                    <Typography variant='size-10' weight='light' color='color-3'>{dashboardData.alertsOpen} Alert{dashboardData.alertsOpen > 1 ? 's' : ''}</Typography>
                                                                </Tooltip>
                                                                <Progress key='progress__inreview' bar={true} className='bg-review'
                                                                    value={dashboardData.alertsInReview} max={totalStatusLevel}
                                                                    data-tip={true} data-for='status-level__inreview'>
                                                                    <Typography variant='size-12' weight='light'>In Review</Typography>
                                                                </Progress>
                                                                <Tooltip id='status-level__inreview' place='bottom'>
                                                                    <Typography variant='size-14' weight='semi-bold' color='color-3'>In Review</Typography>
                                                                    <Typography variant='size-10' weight='light' color='color-3'>{dashboardData.alertsInReview} Alert{dashboardData.alertsInReview > 1 ? 's' : ''}</Typography>
                                                                </Tooltip>
                                                                <Progress key='progress__resolved' bar={true} className='bg-resolve'
                                                                    value={dashboardData.alertsResolved} max={totalStatusLevel}
                                                                    data-tip={true} data-for='status-level__resolved'>
                                                                    <Typography variant='size-12' weight='light'>Resolved</Typography>
                                                                </Progress>
                                                                <Tooltip id='status-level__resolved' place='bottom'>
                                                                    <Typography variant='size-14' weight='semi-bold' color='color-3'>Resolved</Typography>
                                                                    <Typography variant='size-10' weight='light' color='color-3'>{dashboardData.alertsResolved} Alert{dashboardData.alertsResolved > 1 ? 's' : ''}</Typography>
                                                                </Tooltip>
                                                                <Progress key='progress__archived' bar={true} className='bg-archived'
                                                                    value={dashboardData.alertsArchived} max={totalStatusLevel}
                                                                    data-tip={true} data-for='status-level__archived'>
                                                                    <Typography variant='size-12' weight='light'>Archived</Typography>
                                                                </Progress>
                                                                <Tooltip id='status-level__archived' place='bottom'>
                                                                    <Typography variant='size-14' weight='semi-bold' color='color-3'>Archived</Typography>
                                                                    <Typography variant='size-10' weight='light' color='color-3'>{dashboardData.alertsArchived} Alert{dashboardData.alertsArchived > 1 ? 's' : ''}</Typography>
                                                                </Tooltip>
                                                            </Progress>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mt-4 p-3'>
                                <CardBody className='overflow-auto'>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__behaviour-types'>
                                                <Typography color='color-3' variant='size-22' className='playfair-font mb-4'>Current Behaviour Type</Typography>
                                                <div className='dashboard__charts-behaviour-types__chart'>
                                                    {loading || dashboardData.behaviourPerDateSummary === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex mx-auto text-center'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : dashboardData.behaviourPerDateSummary.length > 0
                                                            ? dashboardData.behaviourPerDateSummary.map(data => {
                                                                return (
                                                                    <Row className='d-flex align-items-center mb-2'>
                                                                        <Col xs={5} sm={5} lg={5}
                                                                            xl={5}
                                                                            className='text-right'>
                                                                            <Typography color='color-3' variant='size-14'>{data.behaviour}</Typography>
                                                                        </Col>
                                                                        <Col xs={4} sm={3} lg={3}
                                                                            xl={4}>
                                                                            <Progress value={data.count} max={totalBehaviourTypeNumber[0]} />
                                                                        </Col>
                                                                        <Col xs={2} sm={4} lg={4}
                                                                            xl={3}>
                                                                            <Typography color='color-3' variant='size-14'>{data.count}</Typography>
                                                                        </Col>
                                                                    </Row>
                                                                );
                                                            })
                                                            : <span>No data</span>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card className='mt-4 p-3'>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <div className='dashboard__assigned-alerts'>
                                                <Typography color='color-3' variant='size-22' className='playfair-font mb-4'>Current Assigned Alerts</Typography>
                                                <div className='dashboard__charts-assigned-alerts__chart'>
                                                    {loading || dashboardData.usersPerDateSummary === undefined
                                                        ? <Spinner animation='border' role='status' className='d-flex mx-auto text-center'>
                                                            <span className='sr-only'>Loading...</span>
                                                        </Spinner>
                                                        : dashboardData.behaviourPerDateSummary.length > 0
                                                            ? dashboardData.usersPerDateSummary.map(data => {
                                                                return (
                                                                    <div className='d-flex justify-content-between assigned-alert-1 px-3 py-3 mb-2 bg-light'>
                                                                        <Typography color='color-3' variant='size-14'>{data.user}</Typography>
                                                                        <Typography color='color-3' variant='size-14'>{numberWithCommas(data.count)}</Typography>
                                                                    </div>
                                                                );
                                                            })
                                                            : <span>No data</span>
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

const Dashboard: any = withLoading<React$Element<Props>>(DashboardScreen);

export default Dashboard;
