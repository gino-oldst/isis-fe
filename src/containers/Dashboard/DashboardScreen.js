// @flow
import React from 'react';
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
    Progress
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, Doughnut, Chart } from 'react-chartjs-2';
import {
    lineChartOptions,
    doughnutChartOptions,
    makeLineChartData,
    makeDougnutChartData,
    makeAssignedAlertsData,
    makeBehaviourTypesData,
    makeStatusLevelAlertsData
} from '../../utils/charts';
import './dashboard.scss';

type Props = {
    sidebarMenu: Array<Menu>,
    selectedDate: Date,
    handleDateChange: Function
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
    sidebarMenu,
    selectedDate,
    handleDateChange
}: Props): React$Element<any> {
    return (
        <div className='dashboard'>
            <CollapsibleSidebar
                menu={sidebarMenu} />
            <div className='dashboard__content w-100 overflow-auto'>
                <div className='dashboard__header d-block d-md-flex align-items-center mb-4'>
                    <Typography color='color-3' className='dashboard__title mr-auto mb-4 mb-md-0'>MAR Alerts Overview</Typography>
                    <Button label={<><FontAwesomeIcon className='mr-3' icon='file-download' size='sm' /><span className='font-weight-light'>Download</span></>} className='dashboard__download-button' size='lg' />
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
                                                        value={selectedDate}
                                                        onChange={handleDateChange} />
                                                    <Typography color='color-3' variant='size-16' className='mx-4'>to</Typography>
                                                    <DatePicker
                                                        value={selectedDate}
                                                        onChange={handleDateChange} />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='dashboard__received-alerts py-4'>
                                        <Col lg={12} xl={6}>
                                            <Card>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <img src={receivedIcon} alt='Alerts_Received_Icon' className='mr-4' />
                                                    <Typography className='mr-3 pb-2 playfair-font' color='color-3' weight='semi-bold'
                                                        variant='size-30'>70</Typography>
                                                    <Typography color='color-3' weight='light' variant='size-16'>Alerts Received</Typography>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg={12} xl={6}>
                                            <Card className='mt-xl-0 mt-3'>
                                                <CardBody className='d-flex align-items-center justify-content-center'>
                                                    <img src={resolvedIcon} alt='Alerts_Received_Icon' className='mr-4' />
                                                    <Typography className='mr-3 pb-2 playfair-font' color='color-3' weight='semi-bold'
                                                        variant='size-30'>42</Typography>
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
                                                    <Line
                                                        data={makeLineChartData}
                                                        height={232}
                                                        options={lineChartOptions()} />
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
                                                            <div className='mb-3 mb-md-0'>
                                                                <Doughnut
                                                                    data={makeDougnutChartData}
                                                                    height={180}
                                                                    width={50}
                                                                    responsive={true}
                                                                    options={doughnutChartOptions()} />
                                                            </div>
                                                        </Col>
                                                        <Col sm={12} md={4}>
                                                            <div className='dashboard__escalation-level__labels mb-3 mb-md-0'>
                                                                <div className='dashboard__escalation-level__label1 d-flex align-items-end'>
                                                                    <FontAwesomeIcon className='dashboard__escalation-level__label-icon mr-2 mb-2 pb-1' icon='circle' size='xs'
                                                                        style={{ color: '#d68b5c' }} />
                                                                    <Typography color='color-3' variant='size-30'>23%</Typography>
                                                                </div>
                                                                <div className='dashboard__escalation-level__sublabel1 mt-2'>
                                                                    <Typography color='color-3' variant='size-14' weight='semi-bold'>16 Alerts</Typography>
                                                                    <Typography color='color-3' variant='size-14' weight='light'>Moved from Base to Manager</Typography>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col sm={12} md={4}>
                                                            <div className='dashboard__escalation-level__labels'>
                                                                <div className='dashboard__escalation-level__label2 d-flex align-items-end'>
                                                                    <FontAwesomeIcon className='dashboard__escalation-level__label-icon mr-2 mb-2 pb-1' icon='circle' size='xs'
                                                                        style={{ color: '#3485d5' }} />
                                                                    <Typography color='color-3' variant='size-30'>62%</Typography>
                                                                </div>
                                                                <div className='dashboard__escalation-level__sub-label2 mt-2'>
                                                                    <Typography color='color-3' variant='size-14' weight='semi-bold'>43 Alerts</Typography>
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
                                                    <Progress multi={true}>
                                                        {makeStatusLevelAlertsData().map(data => {
                                                            return (
                                                                <>
                                                                    <Progress key={`progress__${data.id}`} bar={true} className={data.color}
                                                                        value={data.alerts}
                                                                        data-tip={true} data-for={`status-level__${data.id}`}>
                                                                        <Typography variant='size-12' weight='light'>{data.label}</Typography>
                                                                    </Progress>
                                                                    <Tooltip key={data.id} id={`status-level__${data.id}`} place='bottom'>
                                                                        <Typography variant='size-14' weight='semi-bold' color='color-3'>{data.label}</Typography>
                                                                        <Typography variant='size-10' weight='light' color='color-3'>{data.alerts} Alerts</Typography>
                                                                    </Tooltip>
                                                                </>
                                                            );
                                                        })}
                                                    </Progress>
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
                                                    {makeBehaviourTypesData().map(data => {
                                                        return (
                                                            <Row className='d-flex align-items-center mb-2'>
                                                                <Col xs={7} sm={5} lg={4}
                                                                    xl={6}
                                                                    className='text-right'>
                                                                    <Typography color='color-3' variant='size-14'>{data.label}</Typography>
                                                                </Col>
                                                                <Col xs={3} sm={4} lg={6}
                                                                    xl={4}>
                                                                    <Progress value={data.assignedAlerts} />
                                                                </Col>
                                                                <Col xs={2} sm={2} lg={2}
                                                                    xl={2}>
                                                                    <Typography color='color-3' variant='size-14'>{data.assignedAlerts}</Typography>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    })}
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
                                                    {makeAssignedAlertsData().map(data => {
                                                        return (
                                                            <div className='d-flex justify-content-between assigned-alert-1 px-3 py-3 mb-2 bg-light'>
                                                                <Typography color='color-3' variant='size-14'>{data.name}</Typography>
                                                                <Typography color='color-3' variant='size-14'>{data.assignedAlerts}</Typography>
                                                            </div>
                                                        );
                                                    })}
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
