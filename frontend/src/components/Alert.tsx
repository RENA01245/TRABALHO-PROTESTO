import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  return (
    <div className={`alert alert--${variant} ${className}`} role="alert">
      {children}
    </div>
  );
}
