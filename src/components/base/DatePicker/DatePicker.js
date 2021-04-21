// @flow
import React from 'react';
import { MuiPickersUtilsProvider, DatePicker as MaterialUIPicker } from '@material-ui/pickers';
import { createMuiTheme, InputAdornment, Icon } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateFnsUtils from '@date-io/date-fns';
import './date-picker.scss';

type Props = {
    className?: string,
    width: Integer,
    format: string
}

const materialTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#15273E',
            contrastText: '#fff'
        }
    },
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#15273E'
            }
        },
        MuiPickersDay: {
            daySelected: {
                backgroundColor: '#15273E'
            }
        },
        MuiPickersModal: {
            dialogAction: {
                color: '#15273E'
            }
        }
    }
});

export default function DatePicker({
    className = '',
    width = 25,
    format = 'MM/dd/yyyy',
    ...rest
}: Props): React$Element<any> {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={materialTheme}>
                <MaterialUIPicker
                    {...rest}
                    disablePast={true}
                    minDate={new Date()}
                    format={format}
                    animateYearScrolling={true}
                    inputProps={{ style: { fontSize: 15 } }} // font size of input text
                    InputLabelProps={{ style: { fontSize: 15 } }} // font size of input label
                    style={{ width: `${width}%` }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position={'start'}>
                                <Icon>
                                    <FontAwesomeIcon icon='calendar-alt' size='xs' />
                                </Icon>
                            </InputAdornment>)
                    }}/>
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}
