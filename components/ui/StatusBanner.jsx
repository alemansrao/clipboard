export default function StatusBanner({ tone = 'success', message, compact = false }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-300',
    error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300',
    info: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-950 dark:bg-blue-950/30 dark:text-blue-300'
  };

  return (
    <div className={`rounded-2xl border px-4 ${compact ? 'py-2 text-xs' : 'py-3 text-sm'} ${styles[tone] || styles.info}`}>
      {message}
    </div>
  );
}
