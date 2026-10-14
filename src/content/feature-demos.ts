import type { Locale } from '#/i18n/translations'

/**
 * Sample app data shown inside the feature cards. Names and prices are made
 * up; only the labels are translated.
 */
interface ScheduleRow {
  time: string
  kind: 'done' | 'break' | 'booked' | 'free'
  name?: string
  service?: string
  until?: string
  price?: string
  guest?: boolean
  current?: boolean
}

interface FeatureDemos {
  schedule: {
    days: Array<string>
    dates: Array<number>
    activeDay: number
    date: string
    summary: string
    now: string
    breakTitle: string
    breakNote: string
    free: string
    book: string
    rows: Array<ScheduleRow>
  }
  booking: {
    barbers: Array<{ name: string; note: string }>
    service: { name: string; meta: string; price: string }
    day: string
    times: Array<string>
    activeTime: number
  }
  recurring: {
    badge: string
    rows: Array<{ name: string; rule: string }>
  }
  earnings: {
    label: string
    amount: string
    change: string
    note: string
    days: Array<string>
    /** Share of the tallest day: finished and still booked. */
    bars: Array<{ done: number; booked: number }>
    activeDay: number
    done: string
    booked: string
    noShows: string
    noShowsNote: string
  }
  team: {
    days: Array<string>
    /** 1 = works, 0.5 = shorter day, 0 = day off. */
    rows: Array<{ name: string; week: Array<0 | 0.5 | 1> }>
    request: { count: number; title: string; note: string }
  }
}

const shared = {
  bars: [
    { done: 0.8, booked: 0 },
    { done: 0.62, booked: 0 },
    { done: 0.22, booked: 0.32 },
    { done: 0, booked: 0.45 },
    { done: 0, booked: 1 },
    { done: 0, booked: 0.72 },
    { done: 0, booked: 0 },
  ],
  team: [
    { name: 'Kenan', week: [1, 1, 1, 1, 1, 1, 0] },
    { name: 'Amar', week: [1, 1, 1, 1, 1, 0.5, 0] },
    { name: 'Lejla', week: [0, 1, 1, 1, 1, 0.5, 0] },
  ] satisfies FeatureDemos['team']['rows'],
}

export const featureDemos: Record<Locale, FeatureDemos> = {
  bs: {
    schedule: {
      days: ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'],
      dates: [5, 6, 7, 8, 9, 10],
      activeDay: 2,
      date: 'Srijeda, 7. oktobar',
      summary: '7 termina · 108 KM',
      now: 'sad',
      breakTitle: 'Pauza',
      breakNote: 'ručak · do 13:00',
      free: 'Slobodno · 30 min',
      book: 'Zakaži',
      rows: [
        {
          time: '09:00',
          kind: 'done',
          name: 'Haris',
          service: 'Fade',
          until: 'do 09:30',
        },
        {
          time: '09:45',
          kind: 'done',
          name: 'Emir',
          service: 'Samo brada',
          until: 'do 10:05',
        },
        {
          time: '11:00',
          kind: 'done',
          name: 'Faruk',
          service: 'Skin fade',
          until: 'do 11:40',
        },
        { time: '12:00', kind: 'break' },
        {
          time: '13:00',
          kind: 'booked',
          name: 'Mirza',
          service: 'Fade + brada',
          until: 'do 13:45',
          price: '20 KM',
          current: true,
        },
        {
          time: '14:00',
          kind: 'booked',
          name: 'Senad',
          service: 'Klasično · gost',
          until: 'do 14:30',
          price: '12 KM',
          guest: true,
        },
        { time: '15:30', kind: 'free' },
        {
          time: '16:00',
          kind: 'booked',
          name: 'Adnan',
          service: 'Fade',
          until: 'do 16:30',
          price: '15 KM',
        },
        {
          time: '17:30',
          kind: 'booked',
          name: 'Dino',
          service: 'Fade + brada',
          until: 'do 18:15',
          price: '20 KM',
        },
      ],
    },
    booking: {
      barbers: [
        { name: 'Kenan', note: 'tvoj frizer' },
        { name: 'Amar', note: 'od 16:00' },
        { name: 'Lejla', note: 'sutra' },
      ],
      service: {
        name: 'Fade + brada',
        meta: '45 min · tvoje uobičajeno',
        price: '20 KM',
      },
      day: 'Pet 9.',
      times: ['16:00', '16:30', '17:30', '18:00'],
      activeTime: 2,
    },
    recurring: {
      badge: 'stalni',
      rows: [
        { name: 'Haris · Fade', rule: 'Svaka srijeda · 09:00' },
        { name: 'Emir · Brada', rule: 'Svake 2 sedmice · 09:45' },
        { name: 'Adnan · Fade', rule: 'Svaka srijeda · 16:00' },
      ],
    },
    earnings: {
      label: 'Zarada · ova sedmica',
      amount: '255 KM',
      change: '15%',
      note: '+ 393 KM zakazano do subote',
      days: ['P', 'U', 'S', 'Č', 'P', 'S', 'N'],
      bars: shared.bars,
      activeDay: 2,
      done: 'završeno',
      booked: 'zakazano',
      noShows: '1 nedolazak · 2 otkazana',
      noShowsNote: '43 KM propušteno',
    },
    team: {
      days: ['P', 'U', 'S', 'Č', 'P', 'S', 'N'],
      rows: shared.team,
      request: {
        count: 1,
        title: 'Zahtjev čeka',
        note: 'Lejla · slobodan petak, 16. okt',
      },
    },
  },

  en: {
    schedule: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dates: [5, 6, 7, 8, 9, 10],
      activeDay: 2,
      date: 'Wednesday, October 7',
      summary: '7 bookings · 108 KM',
      now: 'now',
      breakTitle: 'Break',
      breakNote: 'lunch · until 13:00',
      free: 'Free · 30 min',
      book: 'Book',
      rows: [
        {
          time: '09:00',
          kind: 'done',
          name: 'Haris',
          service: 'Fade',
          until: 'until 09:30',
        },
        {
          time: '09:45',
          kind: 'done',
          name: 'Emir',
          service: 'Beard only',
          until: 'until 10:05',
        },
        {
          time: '11:00',
          kind: 'done',
          name: 'Faruk',
          service: 'Skin fade',
          until: 'until 11:40',
        },
        { time: '12:00', kind: 'break' },
        {
          time: '13:00',
          kind: 'booked',
          name: 'Mirza',
          service: 'Fade + beard',
          until: 'until 13:45',
          price: '20 KM',
          current: true,
        },
        {
          time: '14:00',
          kind: 'booked',
          name: 'Senad',
          service: 'Classic · guest',
          until: 'until 14:30',
          price: '12 KM',
          guest: true,
        },
        { time: '15:30', kind: 'free' },
        {
          time: '16:00',
          kind: 'booked',
          name: 'Adnan',
          service: 'Fade',
          until: 'until 16:30',
          price: '15 KM',
        },
        {
          time: '17:30',
          kind: 'booked',
          name: 'Dino',
          service: 'Fade + beard',
          until: 'until 18:15',
          price: '20 KM',
        },
      ],
    },
    booking: {
      barbers: [
        { name: 'Kenan', note: 'your barber' },
        { name: 'Amar', note: 'from 16:00' },
        { name: 'Lejla', note: 'tomorrow' },
      ],
      service: {
        name: 'Fade + beard',
        meta: '45 min · your usual',
        price: '20 KM',
      },
      day: 'Fri 9',
      times: ['16:00', '16:30', '17:30', '18:00'],
      activeTime: 2,
    },
    recurring: {
      badge: 'recurring',
      rows: [
        { name: 'Haris · Fade', rule: 'Every Wednesday · 09:00' },
        { name: 'Emir · Beard', rule: 'Every 2 weeks · 09:45' },
        { name: 'Adnan · Fade', rule: 'Every Wednesday · 16:00' },
      ],
    },
    earnings: {
      label: 'Earnings · this week',
      amount: '255 KM',
      change: '15%',
      note: '+ 393 KM booked through Saturday',
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      bars: shared.bars,
      activeDay: 2,
      done: 'done',
      booked: 'booked',
      noShows: '1 no-show · 2 cancelled',
      noShowsNote: '43 KM missed',
    },
    team: {
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      rows: shared.team,
      request: {
        count: 1,
        title: 'Request waiting',
        note: 'Lejla · Friday off, Oct 16',
      },
    },
  },
}

export type { FeatureDemos }
