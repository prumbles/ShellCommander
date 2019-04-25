import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Action from '../actions/Action'
import configurationStore from '../store/configurationStore'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
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
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

// function getFirstSubTab() {
//     return (configurationStore.selectedTab && configurationStore.selectedTab.items.length > 0) 
//         ? configurationStore.selectedTab.items[0] : null;
// }

class CustomizedTabs extends React.Component {
  state = {
    
  };

  handleChange = (event, value) => {
    configurationStore.selectTabItemByText(value)
  };

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['selectedTab', 'selectedTabItem', 'selectedAction']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    const { classes } = this.props;
    const value = configurationStore.selectedTabItem ? configurationStore.selectedTabItem.text : false
    const subTabs = configurationStore.selectedTab ? configurationStore.selectedTab.items : [];

    return (
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
            {subTabs.map((val, ind) => {
                return <Tab 
                    key={val.text} 
                    label={val.text} 
                    value={val.text}
                    disableRipple
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
            })}
        </Tabs>
        <Action></Action>
      </div>
    );
  }
}

CustomizedTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTabs);