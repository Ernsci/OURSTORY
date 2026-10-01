insert into public.people (id, name, initials, birthday, role, traits, position)
values
  ('11111111-1111-1111-1111-111111111111', 'Chaddy', 'C', '2008-10-09',
   'the one who started counting first',
   '["Falls asleep first","Wakes up still talking","Remembers every small thing"]'::jsonb, 1),
  ('22222222-2222-2222-2222-222222222222', 'Rei', 'R', '2008-09-25',
   'the one who decided to stay',
   '["Always one photo behind","Best laugh in the room","Never deletes a blurry picture"]'::jsonb, 2)
on conflict (id) do nothing;

insert into public.journal_entries (id, entry_date, message, feeling)
values
  ('33333333-3333-3333-3333-333333333333', '2026-09-30', '', ''),
  ('44444444-4444-4444-4444-444444444444', '2026-09-26', '', '')
on conflict (id) do nothing;

insert into public.monthsary_entries (id, month, title, theme, body, ritual)
values
  ('51000000-0000-0000-0000-000000000001', 1, 'One month', 'The month everything felt possible',
   'One month of late messages and morning goodbyes. You stopped being a stranger to each other somewhere in here.',
   'Write down the first song that made you think of each other.'),
  ('51000000-0000-0000-0000-000000000002', 2, 'Two months', 'The month of small routines',
   'Two months of the same balcony table, the same sleepy face, the same peace sign. The ordinary days started to feel like the point.',
   'Recreate your very first photo together. Bad lighting encouraged.'),
  ('51000000-0000-0000-0000-000000000003', 3, 'Three months', 'The month it stopped feeling new',
   'Three months in, and somehow still exciting. You know each other’s moods before they arrive.',
   'Swap one letter each. Read them a year from today.'),
  ('51000000-0000-0000-0000-000000000004', 4, 'Four months', 'The month of rain',
   'Four months of sharing an umbrella whether it was needed or not.',
   'Cook something terrible together. Order dessert after.'),
  ('51000000-0000-0000-0000-000000000005', 5, 'Five months', 'The month of almosts',
   'Five months of almost-dates and almost-apologies and almost-losing you to sleep.',
   'Say the thing you have been almost-saying.'),
  ('51000000-0000-0000-0000-000000000006', 6, 'Six months', 'Half a year',
   'Six months of this, and half a year still to go before the year turns over.',
   'Pick one photo from every month. Six photos, one wall.'),
  ('51000000-0000-0000-0000-000000000007', 7, 'Seven months', 'The month of comfort',
   'Seven months of no shoes, no excuses, no performance.',
   'Do the laziest possible date. Then do it again.'),
  ('51000000-0000-0000-0000-000000000008', 8, 'Eight months', 'The month of double texts',
   'Eight months of sending the same three memes in the same hour.',
   'Send the meme. Always send the meme.'),
  ('51000000-0000-0000-0000-000000000009', 9, 'Nine months', 'Almost autumn',
   'Nine months, and the days are getting shorter but you are not.',
   'Take a walk after dark. No phones.'),
  ('51000000-0000-0000-0000-000000000010', 10, 'Ten months', 'Double digits',
   'Ten months. Time is not linear when you are happy.',
   'Count ten good things out loud.'),
  ('51000000-0000-0000-0000-000000000011', 11, 'Eleven months', 'The home stretch',
   'Eleven months of learning each other’s bad moods and staying anyway.',
   'Plan one small thing for next month.'),
  ('51000000-0000-0000-0000-000000000012', 12, 'One year', 'The whole first lap',
   'Twelve months. One whole lap around. This page will be worn soft by now.',
   'Read the letter you wrote in month one. Then cry a little.')
on conflict (id) do nothing;

insert into public.letters (id, author, recipient, letter_date, title, body, signature, position)
values
  ('61000000-0000-0000-0000-000000000001', 'Rei', 'Chaddy', '2026-09-30',
   'The one about ordinary days',
   '["I never wanted to write you something enormous. You are not an enormous person, and I would not want you to be.","I want to write about the balcony table, and how you put your head down on it like the afternoon had personally wronged you. I want to write about the peace sign we made without either of us planning to, like our hands already knew.","If I had to keep one month, it would not be a big one. It would be the one where nothing happened and you still texted me first anyway.","Thank you for being easy to love on a Tuesday."]'::jsonb,
   '— Rei', 1),
  ('61000000-0000-0000-0000-000000000002', 'Chaddy', 'Rei', '2026-09-30',
   'The one about staying awake',
   '["I do not say things in the right order very often, so I am writing it down instead: I think you are the good part of my day, and I have been thinking that since before I had the nerve to say it.","You take the photo one second too late. You fall asleep first. You laugh like the room is yours. All of it, I like.","Two months. I would like to keep going, slowly, for a very long time."]'::jsonb,
   '— Chaddy', 2)
on conflict (id) do nothing;

update public.couple_settings
set title = 'Chaddy & Rei',
    short_title = 'C & R',
    start_date = '2026-08-01',
    tagline = 'Two people, one very pink little book.',
    about = 'This is the place we keep the good stuff — the ordinary afternoons, the loud laughs, the quiet ones too. Start counting from August 1, 2026 and never stop.'
where id = true
  and (tagline = '' or about = '');