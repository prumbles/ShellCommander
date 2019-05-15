import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {

  }
});

class SettingsTabs extends React.Component {
  state = {
  }

  render() {
    return <div>Settings tabs</div>
  }
}

export default withStyles(styles)(SettingsTabs);