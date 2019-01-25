import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Group extends React.Component {
  render() {
    return (
      <div>
        <form noValidate>
          <TextField
            id="time"
            label="Alarm clock"
            type="time"
            defaultValue="07:30"
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 300 // 5 min
            }}
          />
        </form>
        <h1>123</h1>
      </div>
    );
  }
}
