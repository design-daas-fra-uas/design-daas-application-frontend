// Friendly full-panel message for when a page cannot be shown ("no permission",
// "not found"): a large icon in a soft ring, a title, the text and actions.
// `tone` picks the colors: 'warning' | 'info' | 'danger'; `headingLevel` is 'h1'
// when the message is the whole page.
function ErrorState({ icon, tone = 'info', title, children, actions, className = '', headingLevel: Heading = 'h2' }) {
  return (
    <section className={`error-state error-state-${tone} ${className}`.trim()} role="alert">
      <div className="error-state-art" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </div>
      <Heading className="error-state-title">{title}</Heading>
      <div className="error-state-text">{children}</div>
      {actions && <div className="error-state-actions">{actions}</div>}
    </section>
  );
}

export default ErrorState;
