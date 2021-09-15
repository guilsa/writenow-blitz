const getDateYYYYMMDD = (): string => {
  let now = new Date()
  let todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  )
  return todayUTC.toISOString().slice(0, 10)
}

const hasDatePassed = (nowUnixEpoch: number): boolean => {
  let time1 = new Date(nowUnixEpoch).getTime()
  let time2 = Date.now()
  return time1 - time2 < 0
}

const dateInPast = (date) => {
  if (new Date().setHours(0, 0, 0, 0) - date) {
    return true
  }
  return false
}

const dashDelimitedLocalTimeToString = (date: Date): string => {
  const p = (s: number): string | number => (s < 10 ? "0" + s : s)

  const dayOfMonth = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${p(month)}-${p(dayOfMonth)}`
}

const convertDashDelimitedYYYYMMDDToUnixEpoch = (str: string): number => {
  let t: Array<string | number> = []
  t = str.split("-")
  // return Date.UTC(t[0], t[1] - 1, t[2])
  return new Date(t[0], t[1] - 1, t[2]).getTime()
}

export {
  getDateYYYYMMDD,
  hasDatePassed,
  dateInPast,
  dashDelimitedLocalTimeToString,
  convertDashDelimitedYYYYMMDDToUnixEpoch,
}
