import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
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
