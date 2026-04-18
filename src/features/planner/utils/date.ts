const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
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

export function formatMonthYear(date: Date) {
  return monthYearFormatter.format(date);
}

export function startOfMonth(date: Date) {
  const normalized = normalizeDate(date);
  normalized.setDate(1);
  return normalized;
}

export function addMonths(date: Date, months: number) {
  const normalized = startOfMonth(date);
  normalized.setMonth(normalized.getMonth() + months);
  return normalized;
}

export function startOfWeek(date: Date) {
  const normalized = normalizeDate(date);
  const day = normalized.getDay();
  normalized.setDate(normalized.getDate() - day);
  return normalized;
}

export function isSameDay(firstDate: Date, secondDate: Date) {
  return toIsoDate(firstDate) === toIsoDate(secondDate);
}

export function isDateWithinRange(date: Date, startDate: Date, endDate: Date) {
  const target = normalizeDate(date).getTime();
  return target >= normalizeDate(startDate).getTime() && target <= normalizeDate(endDate).getTime();
}
