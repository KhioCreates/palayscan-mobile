const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

export function addDays(date: Date, days: number) {
  const next = normalizeDate(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function toIsoDate(date: Date) {
  return normalizeDate(date).toISOString().slice(0, 10);
}

export function fromIsoDate(isoDate: string) {
  return normalizeDate(new Date(`${isoDate}T12:00:00`));
}

export function buildWindowLabel(startDate: Date, endDate: Date) {
  if (startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
}
