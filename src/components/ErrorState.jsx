// Friendly full-panel message for when a page cannot be shown ("no permission",
// "not found"): a large icon in a soft ring, a title, the text and actions.
// `tone` picks the colors: 'warning' | 'info' | 'danger'.
function ErrorState({ icon, tone = 'info', title, children, actions, className = '' }) {
  return (
    <section className={`error-state error-state-${tone} ${className}`.trim()} role="alert">
      <div className="error-state-art" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </div>
      <h2 className="error-state-title">{title}</h2>
      <div className="error-state-text">{children}</div>
      {actions && <div className="error-state-actions">{actions}</div>}
    </section>
  );
}

export default ErrorState;
