import ViewerPage from './viewer/ViewerPage';

// Shows a connection that is already running (chosen in the header or after
// starting an object on the dashboard); its URL was stored as "connection-env".
const openStoredConnection = () => Promise.resolve(localStorage.getItem('connection-env'));

function ConnectionRunning() {
  return <ViewerPage id="connectionRunning" start={openStoredConnection} />;
}

export default ConnectionRunning;
