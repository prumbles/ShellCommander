import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  jsonField: {
    width: '100%',
    height: 500
  },
  formRoot: {
    padding: 10
  },
  textInput: {
    width: 300
  },
  shellInput: {
    width: '100%',
    height: 300
  },
  shellTextField: {
    fontFamily: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
  },
  transformRoot: {
    margin: "30px 0px 10px 0px",
    display:"block",
    border: "1px solid #ccc",
    padding: 20
  }
});

class EditAction extends React.Component {
  state = {
    selectedTab: "Edit",
    action: {},
    actionJSON: ''
  }

  handleTabChange = (event, value) => {
    if (this.state.selectedTab === 'JSON' && value !== 'JSON') {
      try {
        let action = JSON.parse(this.state.actionJSON)
        this.setState({
          action: action,
          selectedTab: value
        })
      } catch (ex) {
      }
    } else {
      this.setState({
        actionJSON: JSON.stringify(this.state.action, null, '\t'),
        selectedTab: value
      })
    }
  }

  handleJsonChange = (evt) => {
    this.setState({
      actionJSON: evt.target.value
    })
  }

  componentWillMount() {
    let selectedAction = configurationStore.selectedAction
    this.setState({
      action: JSON.parse(JSON.stringify(selectedAction)),
      actionJSON: JSON.stringify(selectedAction, null, '\t')
    })
  }

  componentDidMount() {
    configurationStore.registerStoreChange(this, [{
        event: 'calculateEditingAction', 
        callback: () => {
            configurationStore.setEditingAction(this._getModifiedAction())
        }
    }]);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    const { classes } = this.props
    const { selectedTab } = this.state

    return <div><Tabs
        value={selectedTab}
        onChange={this.handleTabChange}
        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
      >
          <Tab    label="Edit" 
                  value="Edit"
                  disableRipple
                  classes={{ root: classes.tabRoot }} />
          <Tab    label="JSON"
                  value="JSON"
                  disableRipple
                  classes={{ root: classes.tabRoot }} />
      </Tabs>
      <div>
        {this._getComp()}
      </div>
    </div>
  }

  _getComp = () => {
    switch (this.state.selectedTab) {
      case "Edit":
        return this._getEditComp()

      case "JSON":
        return this._getJSONComp()

      default:
        return <div></div>
    }
  }

  handleTextChange = (evt) => {
    let action = this.state.action

    action.text = evt.target.value
    this.setState({
      action: action
    })
  }

  handleURLChange = (evt) => {
    let action = this.state.action

    action.url = evt.target.value
    this.setState({
      action: action
    })
  }

  handleShellChange = (evt) => {
    let action = this.state.action

    action.shell = evt.target.value
    this.setState({
      action: action
    })
  }

  _getModifiedAction = () => {
    switch (this.state.selectedTab) {
      case "Edit":
        return this.state.action

      case "JSON":
        try {
          let action = JSON.parse(this.state.actionJSON)
          return action
        } catch (ex) {
          throw new Error("Malformed JSON")
        }

      default:
        throw new Error("Unexpected Selected Tab")
    }
  }

  _getEditComp = () => {
    const { text, shell, url, transform } = this.state.action
    const { classes } = this.props

    return <div>
      <form className={classes.formRoot}>
        {(text || text === '') &&
          <TextField value={text}
            className={classes.textInput}
            label="Text"
            onChange={this.handleTextChange}></TextField>
        }

        {(url || url === '') &&
          <TextField value={url}
            className={classes.textInput}
            label="URL"
            onChange={this.handleURLChange}></TextField>
        }

        {transform && this._getTransformComp()}

        {(shell || shell === '') &&
          <TextField value={shell}
            className={classes.shellInput}
            label="Shell"
            multiline
            inputProps={{
              className: classes.shellTextField
            }}
            margin="normal"
            onChange={this.handleShellChange}></TextField>
        }
      </form>
    </div>
  }

  _getTransformComp = () => {
    const { classes } = this.props
    const { transform } = this.state.action
    const { start = "", end = "", replace, rowDelimiter = "\\n", rowFilter = "", colDelimiter = "\\s+", hasHeaders = false } = transform
    return <FormControl className={classes.transformRoot} component="fieldset">
        <FormLabel component="legend">Transform</FormLabel>
        <FormGroup>
        <TextField value={start}
            label="Start"
            onChange={this.textFieldChangeEvent(['transform','start'])}></TextField>
        <TextField value={end}
            label="End"
            onChange={this.textFieldChangeEvent(['transform','end'])}></TextField>
        <TextField value={rowDelimiter}
            label="Row Delimiter"
            onChange={this.textFieldChangeEvent(['transform','rowDelimiter'])}></TextField>
        <TextField value={rowFilter}
            label="Row Filter"
            onChange={this.textFieldChangeEvent(['transform','rowFilter'])}></TextField>
        <TextField value={colDelimiter}
            label="Column Delimiter"
            onChange={this.textFieldChangeEvent(['transform','colDelimiter'])}></TextField>
        </FormGroup>
      </FormControl>
  }

  textFieldChangeEvent = (path) => (evt) => {
    let action = this.state.action
    let ptr = action, len = path.length
    for(let i=0;i<(len-1);i++) {
      ptr = ptr[path[i]]
    }
    ptr[path[len-1]] = evt.target.value
    this.setState({
      action: action
    })
  }

  _getJSONComp = () => {
    const { classes } = this.props
    return <div>
      <TextField
            className={classes.jsonField}
            multiline
            value={this.state.actionJSON}
            onChange={this.handleJsonChange}
            margin="normal"
          />
    </div>
  }
}

export default withStyles(styles)(EditAction);