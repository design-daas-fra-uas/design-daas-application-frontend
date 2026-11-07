import { connectInstance } from '../../../api/phases';
import ViewerPage from './viewer/ViewerPage';

// Connects to a running instance chosen on the dashboard.
const connectChosenInstance = () =>
  connectInstance(localStorage.getItem('instance-object-id'), localStorage.getItem('instance-env'));

function InstanceRunning() {
  return <ViewerPage id="instanceRunning" start={connectChosenInstance} />;
}

export default InstanceRunning;
