import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SettingsContext from './SettingsContext'
import SettingsTabs from './SettingsTabs'
import SettingsActions from './SettingsActions'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {

  }
});

class Settings extends React.Component {
  state = {
    selectedTab: "Context"
  }

  handleTabChange = (evt, value) => {
    this.setState({
      selectedTab: value
    })
  }

  render() {
    const { classes } = this.props;
    const { selectedTab } = this.state;

    return< div className={classes.root}> 
      <Tabs
        value={selectedTab}
        onChange={this.handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Context" value="Context" />
        <Tab label="Tabs" value="Tabs" />
        <Tab label="Actions" value="Actions" />
      </Tabs>
      <TabContainer>
        {this._getSelectedTabComp()}
      </TabContainer>
    </div>
  }

  _getSelectedTabComp = () => {
    switch (this.state.selectedTab) {
      case "Context":
        return this._getContextComp()
      
      case "Tabs":
        return this._getTabsComp()
      
      case "Actions":
        return this._getActionsComp()
    }

    return <span></span>
  }

  _getContextComp = () => {
    return <SettingsContext></SettingsContext>
  }

  _getTabsComp = () => {
    return <SettingsTabs></SettingsTabs>
  }

  _getActionsComp = () => {
    return <SettingsActions></SettingsActions>
  }
}

export default withStyles(styles)(Settings);