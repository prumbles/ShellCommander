import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import configurationStore from '../store/configurationStore'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative'
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  selectRoot: {
    color: '#fff',
    left: '5px'
  },
  selectInput: {
    borderBottom: '0px'
  },
  selectIcon: {
    fill: '#fff'
  },
  dialogAppBar: {
    position: 'relative'
  },
  configTextfield: {
    width: '100%'
  },
  loadingHolder: {
    position:'absolute',
    bottom: '0px',
    width:'100%',
    height: 3
  },
  screen: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.1)',
    zIndex: 10000
  },
  editorSection: {
    height:'calc(100vh - 70px)',
    overflow: 'hidden',
  },
  editorCont: {
    height:'calc(100vh - 70px)',
    overflow: 'auto',
    borderBottom: '1px solid #aaa'
  },
  editorContOpen: {
    height:'calc(100vh - 270px)',
    overflow: 'auto',
    borderBottom: '1px solid #aaa'
  },
  editorTextFieldCont: {
    height: 0,
    display:'none'
  },
  editorTextFieldContOpen: {
    height: 200,
    overflow: 'hidden'
  },
  editorTextField: {
    height: 195,
    width: '100%'
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this._editorRef = React.createRef()
  }

  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    settingsOpen: false,
    configurationJSON: '',
    selectedValue: null,
    selectedValueText: ''
  };

  handleSettingsClose = () => {
    this.setState({
      settingsOpen: false
    })
  }

  handleSettingsSave = () => {
    configurationStore.updateConfiguration(
      this.state.configurationJSON
    )
    this.setState({
      settingsOpen: false
    })
  }

  handleSettingsOpen = () => {
    this.setState({
      settingsOpen: true,
      configurationJSON: JSON.parse(JSON.stringify(configurationStore.configuration, null, '\t'))
    })
  }

  handleConfigChange = (val) => {
    this.setState({
      configurationJSON: val
    })
  }

  handleContextChange = (event) => {
    configurationStore.selectContextByText(event.target.value)
  }

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['context', 'configuration', 'loading']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  editorEvent = (data, event) => {
    if (event.type === 'focus') {
      if (typeof data.value !== 'undefined' && data.field === 'shell') {
        console.log(data)
        this.setState({
          selectedValue: data,
          selectedValueText: data.value
        })
      } else {
        this.setState({
          selectedValue: null,
          selectedValueText: ''
        })
      }
    }
  }

  updateConfig = (obj, path, val) => {
    let ptr = obj
    for (let i=0;i<(path.length-1); i++) {
      ptr = ptr[path[i]]
    }

    ptr[path[path.length - 1]] = val
  }

  selectedValueTextChange = (evt) => {
    this.updateConfig(this.state.configurationJSON, this.state.selectedValue.path, evt.target.value)

    this.setState({
      selectedValueText: evt.target.value,
      configurationJSON: this.state.configurationJSON
    })
  }

  render() {
    const { classes } = this.props;
    
    let selectedContext = configurationStore.selectedContext
    let contextItems = configurationStore.configuration.contextItems
    let editor = ''
    let editorContClass = this.state.selectedValue ? classes.editorContOpen : classes.editorCont
    let editorTextFieldCont = this.state.selectedValue ? classes.editorTextFieldContOpen : classes.editorTextFieldCont

    if (this.state.settingsOpen) {
      let selectedValueText = this.selectedValue ? this.selectedValue.value : ''
      editor = <div
          className={classes.editorSection}>
            <div className={editorContClass}>
              <Editor
              ref={this._editorRef}
              value={this.state.configurationJSON}
              onChange={this.handleConfigChange}
              navigationBar={false}
              statusBar={false}
              search={false}
              onEvent={this.editorEvent}
              allowedModes={['tree', 'text', 'form', 'view', 'code']}/>
            </div>
            <div className={editorTextFieldCont}>
              <TextField
                id="standard-multiline-flexible"
                label="Shell"
                multiline
                rowsMax="4"
                className={classes.editorTextField}
                margin="normal"
                value={this.state.selectedValueText}
                onChange={this.selectedValueTextChange}
              />
            </div>
          </div>
    }

    return (
      <div className={classes.root}>
      {configurationStore.loading &&
          <div className={classes.screen}>
          
          </div>
        }
      <Dialog
          fullScreen
          open={this.state.settingsOpen}
          onClose={this.handleSettingsClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.dialogAppBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleSettingsClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Button color="inherit" onClick={this.handleSettingsSave}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <div>
            {editor}
          </div>
        </Dialog>
        <AppBar position="static" color="primary">
          <Toolbar variant="dense">
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Shell Commander
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <FormControl className={classes.formControl}>
                <Select
                  value={selectedContext.text}
                  classes={{root: classes.selectRoot, select: classes.selectInput, icon: classes.selectIcon}}
                  onChange={this.handleContextChange}
                  input={<Input name="context" id="context-auto-width" />}
                  variant="outlined"
                  autoWidth
                >
                  {contextItems.map((val, index) => {
                    return <MenuItem key={val.text} value={val.text}>{val.text}</MenuItem>
                  })}
                </Select>
              </FormControl>
              <IconButton color="inherit" onClick={this.handleSettingsOpen}>
                <SettingsIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {configurationStore.loading &&
          <div className={classes.loadingHolder}>
          <LinearProgress />
          </div>
        }
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);