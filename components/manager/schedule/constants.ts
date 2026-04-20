import { CheckCircleIcon as CheckCircle2, ChartBarIcon as Activity, ClockIcon as Timer } from "@heroicons/react/24/outline"

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const shifts = [
  { id:1, staff:"Peter Ochieng",  role:"Waiter",   day:"Mon", time:"8am – 4pm",  status:"completed", avatar:"PO" },
  { id:2, staff:"Grace Wanjiku",  role:"Manager",  day:"Mon", time:"9am – 6pm",  status:"completed", avatar:"GW" },
  { id:3, staff:"Mary Akinyi",    role:"Kitchen",  day:"Tue", time:"11am – 9pm", status:"active",    avatar:"MA" },
  { id:4, staff:"John Doe",       role:"Waiter",   day:"Tue", time:"2pm – 10pm", status:"active",    avatar:"JD" },
  { id:5, staff:"Alice Kipir",    role:"Kitchen",  day:"Wed", time:"8am – 4pm",  status:"upcoming",  avatar:"AK" },
  { id:6, staff:"Kevin M.",       role:"Waiter",   day:"Wed", time:"4pm – 12am", status:"upcoming",  avatar:"KM" },
  { id:7, staff:"Sarah Lee",      role:"Kitchen",  day:"Thu", time:"7am – 3pm",  status:"upcoming",  avatar:"SL" },
  { id:8, staff:"Michael Chen",   role:"Waiter",   day:"Thu", time:"3pm – 11pm", status:"upcoming",  avatar:"MC" },
]

export const ROLE_CONFIG = {
  Waiter:  { bg:"oklch(0.45 0.12 285 / 0.1)", text:"oklch(0.38 0.12 285)", border:"oklch(0.45 0.12 285 / 0.25)", avatar:"oklch(0.45 0.12 285)" },
  Kitchen: { bg:"oklch(0.75 0.15 75 / 0.1)",  text:"oklch(0.55 0.15 75)",  border:"oklch(0.75 0.15 75 / 0.25)",  avatar:"oklch(0.75 0.15 75)"  },
  Manager: { bg:"oklch(0.62 0.16 150 / 0.1)", text:"oklch(0.42 0.14 150)", border:"oklch(0.62 0.16 150 / 0.25)", avatar:"oklch(0.62 0.16 150)" },
}

export const STATUS_CONFIG = {
  completed: { label:"Completed", bg:"oklch(0.62 0.16 150 / 0.1)", text:"oklch(0.42 0.14 150)", border:"oklch(0.62 0.16 150 / 0.25)", icon:CheckCircle2 },
  active:    { label:"Active",    bg:"oklch(0.45 0.12 285 / 0.1)", text:"oklch(0.38 0.12 285)", border:"oklch(0.45 0.12 285 / 0.25)", icon:Activity     },
  upcoming:  { label:"Upcoming",  bg:"oklch(0.75 0.15 75 / 0.1)",  text:"oklch(0.55 0.15 75)",  border:"oklch(0.75 0.15 75 / 0.25)",  icon:Timer        },
}
