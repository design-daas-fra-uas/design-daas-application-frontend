import { startBaseImage, startEnvironment, withFallback } from '../../../api/phases';
import ViewerPage from './viewer/ViewerPage';

// Opens a shared object: as a base image, or as an environment if it is one.
const startSharedObject = () => {
  const id = localStorage.getItem('connection-shared-object-id');
  const name = localStorage.getItem('connection-shared-env');
  return withFallback(
    () => startBaseImage(id),
    () => startEnvironment(id, name),
  );
};

function SharedRunning() {
  return <ViewerPage id="connectionRunning" start={startSharedObject} />;
}

export default SharedRunning;
