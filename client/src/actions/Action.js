import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import configurationStore from '../store/configurationStore'
import Button from '@material-ui/core/Button';
import ResultCreator from './ResultCreator'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditAction from '../settings/EditAction'
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  root: {
    width: "100%",
    overflow: "auto",
    padding: 5,
    position: "relative"
  },
  formContainer: {
 
  },
  buttonContainer: {
    
  },
  form: {

  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  msg: {
    textAlign: 'left'
  },
  errorMsg: {
    color:"red"
  },
  editButton: {
    position: 'fixed',
    right: 30,
    bottom: 30
  }
});

class Action extends React.Component {
  state = {
    inputValues: [],
    isEditingAction: false
  };

  handleChange = inp => event => {
    inp.value = event.target.value
    this.setState(this.state)
  }

  _fixActionOnChange = (isPrevious) => {
    let action = configurationStore.selectedAction
    if (action) {
        if (this._actionRequiresInput(action)) {
            let inputValues = []
            if (isPrevious) {
              let chainItem = configurationStore.getActionChainItem(action)

              if (chainItem && chainItem.inputVariables) {
                chainItem.inputVariables.forEach(iv => {
                  inputValues.push({
                      text: iv.text,
                      value: iv.value
                  })
                })
              }

            } else {
              action.inputs.forEach(i => {
                  let eqIndex = i.indexOf('=')
                  let txt = i
                  let val = ''

                  if (eqIndex > 0) {
                    txt = i.substr(0, eqIndex)
                    val = i.substr(eqIndex + 1)
                  }

                  inputValues.push({
                      text: txt,
                      value: val
                  })
              })
            }

            this.setState({inputValues: inputValues})
        } else {
            this.setState({inputValues: []})
            if (!isPrevious) {
              configurationStore.runSelectedAction()
            }
        }
    } else {
      this.setState({inputValues: []})
    }
  }

  componentDidMount() {
    configurationStore.registerStoreChange(this, [
        {
            event: 'selectedAction', 
            callback: () => {
                this._fixActionOnChange(false)
            }
        }, 
        'actionResponse',
        {
            event: 'selectedPreviousAction',
            callback: () => {
              this._fixActionOnChange(true)
            }
        }
    ]);
  }

  execute = (e) => {
    configurationStore.runSelectedAction(this.state.inputValues)
  }

  onFormSubmit = e => {
    e.preventDefault();
    this.execute()
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  exitEditingAction = () => {
    this.setState({
      isEditingAction: false
    })
  }

  saveEditingAction = () => {
    configurationStore.updateCurrentAction()
    this.setState({
      isEditingAction: false
    })
  }

  startEditingAction = () => {
    this.setState({
      isEditingAction: true
    })
  }

  render() {
    const { classes } = this.props;
    let resp = <div></div>
    if (configurationStore.actionResponse) {
      resp = ResultCreator.getComponent(configurationStore.selectedAction, configurationStore.actionResponse)
    }

    let inputs = []

    if (this.state.inputValues && this.state.inputValues.length > 0) {
        this.state.inputValues.forEach(i => {
            inputs.push(
                <TextField
                  label={i.text}
                  key={i.text}
                  className={classes.textField}
                  value={i.value}
                  onChange={this.handleChange(i)}
                  margin="normal"
                />)
        })
    }


    return (
      <div className={classes.root}>
        <Dialog
          maxWidth="xl"
          fullWidth={true}
          open={this.state.isEditingAction}
          onClose={this.exitEditingAction}
        >
          <DialogTitle>Edit Action</DialogTitle>
          <DialogContent>
            {this.state.isEditingAction &&
              <EditAction></EditAction>
            }
          </DialogContent>
          <DialogActions>
          <Button onClick={this.exitEditingAction} color="primary">
              Cancel
            </Button>
            <Button onClick={this.saveEditingAction} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.formContainer}>
            <form className={classes.form} noValidate autoComplete="off" onSubmit={this.onFormSubmit}>
                {inputs}
            </form>
            <div className={classes.buttonContainer}>
              {inputs.length > 0 &&
                  <Button size="small" variant="contained" color="primary" className={classes.button} onClick={this.execute}>
                    Execute
                  </Button>
                }
            </div>
        </div>
        <div className={classes.msg}>{resp}</div>
        <Fab style={{display: configurationStore.selectedAction ? "flex" : "none"}} size="small" color="secondary" aria-label="Edit" className={classes.editButton} onClick={this.startEditingAction}>
          <EditIcon></EditIcon>
        </Fab>
      </div>
    );
  }

  _actionRequiresInput = (action) => {
        return action.inputs ? true : false
    }
}

export default withStyles(styles)(Action);