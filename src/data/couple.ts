export interface CoupleSettings {
  title: string
  shortTitle: string
  startDate: string
  tagline: string
  about: string
}

export const defaultCouple: CoupleSettings = {
  title: 'Chaddy & Rei',
  shortTitle: 'C & R',
  startDate: '2026-08-01',
  tagline: 'Two people, one very pink little book.',
  about:
    'This is the place we keep the good stuff — the ordinary afternoons, the loud laughs, the quiet ones too. Start counting from August 1, 2026 and never stop.',
}

export interface Person {
  id: string
  name: string
  initials: string
  birthday: string
  role: string
  traits: string[]
}

export const defaultPeople: Person[] = [
  {
    id: 'chaddy',
    name: 'Chaddy',
    initials: 'C',
    birthday: '2008-10-09',
    role: 'the one who started counting first',
    traits: ['Falls asleep first', 'Wakes up still talking', 'Remembers every small thing'],
  },
  {
    id: 'rei',
    name: 'Rei',
    initials: 'R',
    birthday: '2008-09-25',
    role: 'the one who decided to stay',
    traits: ['Always one photo behind', 'Best laugh in the room', 'Never deletes a blurry picture'],
  },
]

export interface JournalEntry {
  id: string
  date: string
  message: string
  feeling: string
}

export const defaultJournal: JournalEntry[] = [
  { id: 'entry-2026-09-30', date: '2026-09-30', message: '', feeling: '' },
  { id: 'entry-2026-09-26', date: '2026-09-26', message: '', feeling: '' },
]

export interface Letter {
  id: string
  from: string
  to: string
  date: string
  title: string
  body: string[]
  signature: string
}

export const defaultLetters: Letter[] = [
  {
    id: 'letter-from-rei',
    from: 'Rei',
    to: 'Chaddy',
    date: '2026-09-30',
    title: 'The one about ordinary days',
    body: [
      'I never wanted to write you something enormous. You are not an enormous person, and I would not want you to be.',
      'I want to write about the balcony table, and how you put your head down on it like the afternoon had personally wronged you. I want to write about the peace sign we made without either of us planning to, like our hands already knew.',
      'If I had to keep one month, it would not be a big one. It would be the one where nothing happened and you still texted me first anyway.',
      'Thank you for being easy to love on a Tuesday.',
    ],
    signature: '— Rei',
  },
  {
    id: 'letter-from-chaddy',
    from: 'Chaddy',
    to: 'Rei',
    date: '2026-09-30',
    title: 'The one about staying awake',
    body: [
      'I do not say things in the right order very often, so I am writing it down instead: I think you are the good part of my day, and I have been thinking that since before I had the nerve to say it.',
      'You take the photo one second too late. You fall asleep first. You laugh like the room is yours. All of it, I like.',
      'Two months. I would like to keep going, slowly, for a very long time.',
    ],
    signature: '— Chaddy',
  },
]