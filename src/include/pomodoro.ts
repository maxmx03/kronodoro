import { reactive } from 'vue'

export interface Config {
  focus: number
  shortBreak: number
  longBreak: number
  interval: number
}

export type Session = 'focus' | 'break' | 'long break'

export interface Pomodoro {
  pomodoros: number
  session: Session
  pause: boolean
  notify: boolean
  running: boolean
}

export const config = reactive<Config>({
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  interval: 4,
})
