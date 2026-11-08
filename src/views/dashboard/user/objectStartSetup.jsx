import { runEnvironment, startEnvironment } from '../../../api/phases';
import { cachedViewer } from './viewer/useViewerSession';
import ViewerPage from './viewer/ViewerPage';

// Last step of the expert mode: starts or runs the environment set up before.
const startExpertEnvironment = () => {
  const id = localStorage.getItem('expert-mode-environment-id');
  const name = localStorage.getItem('expert-mode-environment-env');
  const starts = {
    start: () => startEnvironment(id, name),
    run: () => runEnvironment(id, name),
  };
  return cachedViewer('object-viewer-id', starts[localStorage.getItem('expert-mode-environment-type')]);
};

function ObjectStartSetup() {
  return <ViewerPage id="objectStartSetup" start={startExpertEnvironment} />;
}

export default ObjectStartSetup;
