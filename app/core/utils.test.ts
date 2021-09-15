import {
  dashDelimitedLocalTimeToString,
  convertDashDelimitedYYYYMMDDToUnixEpoch,
  dateInPast,
} from "./utils"

describe("dates", () => {
  xit("hasDatePassed to be true", () => {
    const secondsOffset = 420 * 60
    const unixEpoch = new Date("1983-09-15T07:00:00.000Z").getTime()
    expect(dateInPast(unixEpoch - secondsOffset)).toBe(true)
  })

  xit("hasDatePassed to be false", () => {
    const secondsOffset = 420 * 60
    const unixEpoch = new Date("2099-09-15T07:00:00.000Z").getTime()
    expect(dateInPast(unixEpoch - secondsOffset)).toBe(false)
  })

  it("dashDelimitedLocalTimeToString", () => {
    expect(
      dashDelimitedLocalTimeToString(new Date("1983-09-15T07:00:00.000Z"))
    ).toEqual("1983-09-15")
  })

  it("convertDashDelimitedYYYYMMDDToUnixEpoch", () => {
    const unixEpoch = new Date("1983-09-15T07:00:00.000Z").getTime()
    expect(convertDashDelimitedYYYYMMDDToUnixEpoch("1983-09-15")).toEqual(
      unixEpoch
    )
  })
})
