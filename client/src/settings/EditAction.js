import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';

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
    this.setState({
      action: JSON.parse(JSON.stringify(configurationStore.selectedAction)),
      actionJSON: JSON.stringify(configurationStore.selectedAction, null, '\t')
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
          throw "Malformed JSON"
        }

      default:
        throw "Unexpected Selected Tab"
    }
  }

  _getEditComp = () => {
    const { text, shell, url } = this.state.action
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

        {(shell || shell === '') &&
          <TextField value={shell}
            className={classes.shellInput}
            label="Shell"
            multiline
            margin="normal"
            onChange={this.handleShellChange}></TextField>
        }
      </form>
    </div>
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