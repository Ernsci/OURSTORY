import type { Person } from '../data/couple'
import type { MonthsaryEntry } from '../data/monthsaries'
import { addMonths, completedMonths, daysBetween, isSameDay, parseDate } from './date'

export function firstDayOf(startDate: string): Date {
  return parseDate(startDate)
}

export function monthsaryDateOf(startDate: string, month: number): Date {
  return addMonths(firstDayOf(startDate), month)
}

export function monthsaryWindowOf(startDate: string, month: number) {
  return {
    from: monthsaryDateOf(startDate, month),
    to: monthsaryDateOf(startDate, month + 1),
  }
}

export function nextMonthsaryOf(startDate: string, entries: MonthsaryEntry[], now: Date) {
  const reached = completedMonths(firstDayOf(startDate), now)
  const current = monthsaryDateOf(startDate, reached)
  const upcoming = monthsaryDateOf(startDate, reached + 1)
  const pick = (month: number) =>
    entries.find((entry) => entry.month === month) ?? entries[entries.length - 1]

  return {
    reached,
    current,
    currentIsToday: isSameDay(current, now),
    upcoming,
    daysToUpcoming: daysBetween(now, upcoming),
    entry: pick(reached === 0 ? 1 : reached),
    nextEntry: pick(reached + 1),
  }
}

export function upcomingBirthdaysOf(people: Person[], now: Date) {
  return people
    .map((person) => {
      const birthday = parseDate(person.birthday)
      const build = (year: number) =>
        new Date(
          year,
          birthday.getMonth(),
          Math.min(birthday.getDate(), new Date(year, birthday.getMonth() + 1, 0).getDate()),
        )
      let date = build(now.getFullYear())
      if (date.getTime() <= now.getTime()) date = build(now.getFullYear() + 1)
      return { person, date, days: daysBetween(now, date) }
    })
    .sort((a, b) => a.days - b.days)
}