import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TabActions from './TabActions'
import configurationStore from '../store/configurationStore'


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
  }
});

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    
  };

  handleChange = (event, value) => {
    configurationStore.selectTabByText(value)
  };

  componentDidMount() {
    configurationStore.registerStoreChange(this, ['configuration', 'selectedTab']);
  }

  componentWillUnmount() {
    configurationStore.deregisterStoreChange(this)
  }

  render() {
    const { classes } = this.props;

    let value = configurationStore.selectedTab ? configurationStore.selectedTab.text : null
    let tabs = configurationStore.configuration.tabs

    return (
      <div className={classes.root}>
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
                return <Tab key={val.text} label={val.text} value={val.text} />
            })}
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