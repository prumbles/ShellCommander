import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TabActions from './TabActions'
import configurationStore from '../store/configurationStore'
import AddIcon from '@material-ui/icons/Add';
import AddTab from '../settings/AddTab'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  add: {
    width: 40,
    minWidth: 40
  },
  addIcon: {
    fill: '#090'
  },
  deleteIcon: {
    fill: '#c00',
    position: 'relative',
    top: 5
  }
});

class ScrollableTabsButtonAuto extends React.Component {
  state = {
  };

  handleChange = (event, value) => {
    if (value === '_addTab') {
      configurationStore.beginAddNewTab()
    } else {
      configurationStore.selectTabByText(value)
    }
  };

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['configuration', 'selectedTab', 'addNewTab', 'editMode']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    const { classes } = this.props;

    let value = configurationStore.selectedTab ? configurationStore.selectedTab.text : null
    let tabs = configurationStore.configuration.tabs
    let addTabComp = ''
    if (configurationStore.addingNewTab) {
      addTabComp = <AddTab />
    }

    return (
      <div className={classes.root}>
        {addTabComp}
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((val, ind) => {
                let valComp = val.text
                if (configurationStore.editMode) {
                  valComp = <div>{val.text}<DeleteIcon className={classes.deleteIcon} />
                  </div>
                }
                return <Tab key={val.text} label={valComp} value={val.text} />
            })}
            {configurationStore.editMode &&
              <Tab value="_addTab" className={classes.add} icon={<AddIcon className={classes.addIcon} />} />            
            }
          </Tabs>
        </AppBar>
        <TabContainer>
            <TabActions></TabActions>
        </TabContainer>
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);