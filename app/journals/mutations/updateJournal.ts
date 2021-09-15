import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

// import { hasDatePassed, convertDashDelimitedYYYYMMDDToUnixEpoch } from "app/core/utils"

// export class IsReadOnlyError extends Error {
//   name = "IsReadOnlyError"
//   message = "Can't edit posts with dates in the past."
// }

const UpdateJournal = z.object({
  id: z.number(),
  content: z.string(),
  wordCount: z.number(),
  dateId: z.string(),
  // clientOffsetSeconds: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateJournal),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // const nowUNIXEpoch = convertDashDelimitedYYYYMMDDToUnixEpoch(data.dateId)
    // if (hasDatePassed(nowUNIXEpoch, data.clientOffsetSeconds)) {
    //   throw new IsReadOnlyError()
    // }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journal = await db.journal.update({ where: { id }, data })

    return journal
  }
)
