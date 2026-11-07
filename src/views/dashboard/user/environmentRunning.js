import { runEnvironment, startBaseImage, startEnvironment, withFallback } from '../../../api/phases';
import { cachedViewer } from './viewer/useViewerSession';
import ViewerPage from './viewer/ViewerPage';

// Opens an environment chosen on the dashboard. "start" falls back to starting
// the object as a base image when it is not an environment; "run" runs it.
const startChosenEnvironment = () => {
  const id = localStorage.getItem('env-object-id');
  const name = localStorage.getItem('env-name');
  const starts = {
    start: () =>
      withFallback(
        () => startEnvironment(id, name),
        () => startBaseImage(id),
      ),
    run: () => runEnvironment(id, name),
  };
  return cachedViewer('environment-viewer-id', starts[localStorage.getItem('environment-type-mode')]);
};

function EnvironmentRunning() {
  return <ViewerPage id="environmentRunning" start={startChosenEnvironment} />;
}

export default EnvironmentRunning;
