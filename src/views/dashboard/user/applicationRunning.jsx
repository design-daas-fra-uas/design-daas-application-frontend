import { cloneBaseImageFromApp, createBaseImageFromApp } from '../../../api/phases';
import { cachedViewer } from './viewer/useViewerSession';
import ViewerPage from './viewer/ViewerPage';

// Opens an application chosen on the dashboard: as a new base image ("create")
// or as a clone ("clone"); a viewer started earlier in this session is reused.
const START_BY_OPTION = {
  create: createBaseImageFromApp,
  clone: cloneBaseImageFromApp,
};

const startApplication = () => {
  const appId = localStorage.getItem('app-data');
  const start = START_BY_OPTION[localStorage.getItem('app-data-option')];
  return cachedViewer('application-viewer-id', start && (() => start(appId)));
};

function ApplicationRunning() {
  return <ViewerPage id="applicationRunning" start={startApplication} />;
}

export default ApplicationRunning;
