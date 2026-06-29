import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({ title, headerAction, children, footer, className = '' }: CardProps) {
  const hasHeader = title || headerAction;

  return (
    <div className={`card ${className}`}>
      {hasHeader && (
        <div className="card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {headerAction}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
