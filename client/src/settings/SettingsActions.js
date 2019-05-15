import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import configurationStore from '../store/configurationStore'
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {

  }
});

class SettingsActions extends React.Component {
  state = {
  }

  render() {
    return <div>Settings actions</div>
  }
}

export default withStyles(styles)(SettingsActions);