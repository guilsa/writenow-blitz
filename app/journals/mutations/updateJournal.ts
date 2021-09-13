import { resolver } from "blitz"
import db from "db"
import { date, z } from "zod"

import { hasDatePassed } from "app/core/utils"

export class DayHasPassedError extends Error {
  name = "DayHasPassedError"
  message = "Can't edit posts with dates in the past."
}

const UpdateJournal = z.object({
  id: z.number(),
  content: z.string(),
  wordCount: z.number(),
  dateId: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateJournal),
  resolver.authorize(),
  async ({ id, ...data }) => {
    if (hasDatePassed(data.dateId)) {
      throw new DayHasPassedError()
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journal = await db.journal.update({ where: { id }, data })

    return journal
  }
)
