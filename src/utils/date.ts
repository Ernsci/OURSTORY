const MS_DAY = 86_400_000

const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date)
  const day = next.getDate()
  next.setDate(1)
  next.setMonth(next.getMonth() + months)
  const lastDayOfMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(day, lastDayOfMonth))
  return next
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12)
}

export function completedMonths(from: Date, to: Date): number {
  const rough =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  const safe = addMonths(from, rough).getTime() > to.getTime() ? rough - 1 : rough
  return Math.max(0, safe)
}

export interface Elapsed {
  totalMs: number
  totalDays: number
  years: number
  months: number
  monthsIntoYear: number
  daysAfterLastMonthsary: number
  hours: number
  minutes: number
  seconds: number
}

export function elapsedSince(from: Date, now: Date): Elapsed {
  const totalMs = Math.max(0, now.getTime() - from.getTime())
  const months = completedMonths(from, now)
  const lastMonthsary = addMonths(from, months)
  return {
    totalMs,
    totalDays: Math.floor(totalMs / MS_DAY),
    years: Math.floor(months / 12),
    months,
    monthsIntoYear: months % 12,
    daysAfterLastMonthsary: Math.max(0, Math.floor((now.getTime() - lastMonthsary.getTime()) / MS_DAY)),
    hours: Math.floor((totalMs % MS_DAY) / 3_600_000),
    minutes: Math.floor((totalMs % 3_600_000) / 60_000),
    seconds: Math.floor((totalMs % 60_000) / 1000),
  }
}

export function nextOccurrence(birthday: Date, now: Date): Date {
  const month = birthday.getMonth()
  const build = (year: number) =>
    new Date(year, month, Math.min(birthday.getDate(), new Date(year, month + 1, 0).getDate()))
  const thisYear = build(now.getFullYear())
  return thisYear.getTime() > now.getTime() ? thisYear : build(now.getFullYear() + 1)
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_DAY)
}

export function isSameDay(a: Date, b: Date): boolean {
  return daysBetween(a, b) === 0
}

export function ageOn(birthday: Date, on: Date): number {
  let age = on.getFullYear() - birthday.getFullYear()
  const thisYear = new Date(on.getFullYear(), birthday.getMonth(), birthday.getDate())
  if (thisYear.getTime() > on.getTime()) age -= 1
  return age
}

export function stamp(date: Date): string {
  return `${MONTHS_SHORT[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${date.getFullYear()}`
}

export function stampWithDay(date: Date): string {
  return `${WEEKDAYS_SHORT[date.getDay()]} · ${stamp(date)}`
}

export function humanDate(date: Date): string {
  return `${MONTHS_LONG[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export function monthLabel(date: Date): string {
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`
}

export function clockLabel(date: Date): string {
  const hours = String(date.getHours() % 12 || 12).padStart(2, '0')
  return `${hours}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() < 12 ? 'AM' : 'PM'}`
}

export function ordinal(n: number): string {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const FILENAME_DATE =
  /(?:^|[^\d])(\d{4})[_\-. ]?(\d{2})[_\-. ]?(\d{2})(?:[_\-. ]?(\d{2})[_\-. ]?(\d{2})(?:[_\-. ]?(\d{2}))?)?/

export function parsePhotoDate(filename: string): Date | null {
  const match = FILENAME_DATE.exec(filename)
  if (!match) return null
  const [, year, month, day, hour, minute, second] = match
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour ?? 0),
    Number(minute ?? 0),
    Number(second ?? 0),
  )
  if (Number.isNaN(date.getTime())) return null
  if (date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null
  return date
}