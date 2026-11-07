import React from 'react';

import { createLogger } from '../utils/logger';

const log = createLogger('ErrorBoundary');

// Last line of defence: shows a reload button instead of a blank page when a view crashes.
export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    log.error(`Unhandled render error: ${error.message}`, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="p-4">
          <p>Something went wrong.</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.assign('/')}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
