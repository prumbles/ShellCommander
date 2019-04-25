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

const styles = theme => ({
  root: {
    width: '100%',
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
  }
});

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null
  };

  handleContextChange = (event) => {
    configurationStore.selectContextByText(event.target.value)
  }

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['context', 'configuration']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    const { classes } = this.props;
    
    let selectedContext = configurationStore.selectedContext
    let contextItems = configurationStore.configuration.contextItems

    return (
      <div className={classes.root}>
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
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PrimarySearchAppBar);