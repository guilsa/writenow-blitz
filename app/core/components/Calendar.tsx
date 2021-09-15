import { useQuery } from "blitz"
import getJournalCompletedDays from "app/journals/queries/getJournalCompletedDays"

import { convertDashDelimitedYYYYMMDDToUnixEpoch } from "../utils"

const Grid = ({ completed, tooltip }) => {
  return (
    <div
      title={tooltip}
      style={{
        width: 15,
        height: 25,
        borderColor: "#35973f",
        backgroundColor: completed && "#35973f",
        borderWidth: 2,
        borderStyle: "solid",
        marginRight: 2,
        display: "inline-block",
      }}
    ></div>
  )
}

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

interface RawCal {
  date: string
}

const generateMonthlyCalendar = (month: number, year: number): RawCal[] => {
  const result: RawCal[] = []
  const daysInMonth = getDaysInMonth(month, year)
  const format = (s: number) => (s < 10 ? "0" + s : s)
  for (let i = 1; i <= daysInMonth; i++) {
    result.push({ date: `${`2021`}-${`09`}-${format(i)}` })
  }
  return result
}

const mergeObjs = (calendar: RawCal[], userCompletedDays) => {
  return calendar.map((i) =>
    userCompletedDays.includes(i.date)
      ? { date: i.date, completed: true }
      : { date: i.date, completed: false }
  )
}

const Calendar = () => {
  const [userCompletedDays] = useQuery(getJournalCompletedDays, null)
  const emptyCalendar = generateMonthlyCalendar(9, 2021)
  const filledCalendar = mergeObjs(emptyCalendar, userCompletedDays)

  return (
    <>
      <div style={{ width: "100%", display: "inline-block" }}>
        {filledCalendar?.map((data, idx) => (
          <Grid
            key={idx}
            completed={data.completed}
            tooltip={new Date(
              convertDashDelimitedYYYYMMDDToUnixEpoch(data.date)
            ).toDateString()}
          />
        ))}
      </div>
    </>
  )
}

export default Calendar
