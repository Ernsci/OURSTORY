export interface MonthsaryEntry {
  id: string
  month: number
  title: string
  theme: string
  body: string
  ritual: string
}

export const defaultMonthsaries: MonthsaryEntry[] = [
  {
    id: 'monthsary-1',
    month: 1,
    title: 'One month',
    theme: 'The month everything felt possible',
    body: 'One month of late messages and morning goodbyes. You stopped being a stranger to each other somewhere in here.',
    ritual: 'Write down the first song that made you think of each other.',
  },
  {
    id: 'monthsary-2',
    month: 2,
    title: 'Two months',
    theme: 'The month of small routines',
    body: 'Two months of the same balcony table, the same sleepy face, the same peace sign. The ordinary days started to feel like the point.',
    ritual: 'Recreate your very first photo together. Bad lighting encouraged.',
  },
  {
    id: 'monthsary-3',
    month: 3,
    title: 'Three months',
    theme: 'The month it stopped feeling new',
    body: 'Three months in, and somehow still exciting. You know each other’s moods before they arrive.',
    ritual: 'Swap one letter each. Read them a year from today.',
  },
  {
    id: 'monthsary-4',
    month: 4,
    title: 'Four months',
    theme: 'The month of rain',
    body: 'Four months of sharing an umbrella whether it was needed or not.',
    ritual: 'Cook something terrible together. Order dessert after.',
  },
  {
    id: 'monthsary-5',
    month: 5,
    title: 'Five months',
    theme: 'The month of almosts',
    body: 'Five months of almost-dates and almost-apologies and almost-losing you to sleep.',
    ritual: 'Say the thing you have been almost-saying.',
  },
  {
    id: 'monthsary-6',
    month: 6,
    title: 'Six months',
    theme: 'Half a year',
    body: 'Six months of this, and half a year still to go before the year turns over.',
    ritual: 'Pick one photo from every month. Six photos, one wall.',
  },
  {
    id: 'monthsary-7',
    month: 7,
    title: 'Seven months',
    theme: 'The month of comfort',
    body: 'Seven months of no shoes, no excuses, no performance.',
    ritual: 'Do the laziest possible date. Then do it again.',
  },
  {
    id: 'monthsary-8',
    month: 8,
    title: 'Eight months',
    theme: 'The month of double texts',
    body: 'Eight months of sending the same three memes in the same hour.',
    ritual: 'Send the meme. Always send the meme.',
  },
  {
    id: 'monthsary-9',
    month: 9,
    title: 'Nine months',
    theme: 'Almost autumn',
    body: 'Nine months, and the days are getting shorter but you are not.',
    ritual: 'Take a walk after dark. No phones.',
  },
  {
    id: 'monthsary-10',
    month: 10,
    title: 'Ten months',
    theme: 'Double digits',
    body: 'Ten months. Time is not linear when you are happy.',
    ritual: 'Count ten good things out loud.',
  },
  {
    id: 'monthsary-11',
    month: 11,
    title: 'Eleven months',
    theme: 'The home stretch',
    body: 'Eleven months of learning each other’s bad moods and staying anyway.',
    ritual: 'Plan one small thing for next month.',
  },
  {
    id: 'monthsary-12',
    month: 12,
    title: 'One year',
    theme: 'The whole first lap',
    body: 'Twelve months. One whole lap around. This page will be worn soft by now.',
    ritual: 'Read the letter you wrote in month one. Then cry a little.',
  },
]