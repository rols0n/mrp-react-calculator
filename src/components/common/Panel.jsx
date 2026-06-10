export default function Panel({ id, title, description, action, children, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()} id={id}>
      {(title || description || action) && (
        <div className="panel-title">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
