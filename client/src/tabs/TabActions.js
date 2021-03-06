import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Action from '../actions/Action'
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Link from '@material-ui/core/Link';
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
  breadcrumbCont: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

class CustomizedTabs extends React.Component {
  state = {
    
  };

  chainItemClick = (event, chainItem) => {
    event.preventDefault()

    configurationStore.selectPreviousAction(chainItem)
  }

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
    const { classes, key } = this.props;
    const value = configurationStore.selectedTabItem ? configurationStore.selectedTabItem.text : false
    const subTabs = configurationStore.selectedTab ? configurationStore.selectedTab.items : [];

    let breadcrumbItems = []
    if (configurationStore.actionChain.length > 0) {
      for (let i=0;i<(configurationStore.actionChain.length - 1);i++) {
        let chainItem = configurationStore.actionChain[i]

        breadcrumbItems.push(
          <Link key={chainItem._id} color="inherit" href="/" onClick={(event) => { this.chainItemClick(event, chainItem) }}>
            {chainItem.text}
          </Link>
        )
      }

      const lastItem = configurationStore.actionChain[configurationStore.actionChain.length - 1]
      breadcrumbItems.push(
        <Typography key={lastItem._id} color="textPrimary">{lastItem.text}</Typography>
      )
    }

    return (
      <div className={classes.root} key={key}>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          variant="scrollable"
          scrollButtons="auto"
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
        {breadcrumbItems.length > 0 && 
          <div className={classes.breadcrumbCont}>
            <Breadcrumbs aria-label="Breadcrumb">
              {breadcrumbItems}
            </Breadcrumbs>
          </div>
        }
        <Action></Action>
      </div>
    );
  }
}

CustomizedTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTabs);