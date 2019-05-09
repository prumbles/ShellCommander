import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import configurationStore from '../store/configurationStore'

export default class FormDialog extends React.Component {
  state = {
    value: ''
  };

  handleClose = () => {
    configurationStore.endAddNewTab()
  }

  handleSave = () => {
    if (this.state.value.length > 0) {
      configurationStore.saveNewTab(this.state.value)
    }
  }

  titleChanged = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['addNewTab']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    return (
      <div>
        <Dialog
          open={true}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Tab</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type in a title for your new tab
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              value={this.state.value}
              onChange={this.titleChanged}
              label="Tab Title"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}