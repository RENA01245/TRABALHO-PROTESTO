interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
