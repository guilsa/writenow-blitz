import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetJournal = z.object({
  // This accepts type of undefined, but is required at runtime
  dateId: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetJournal),
  resolver.authorize(),
  async ({ dateId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journal = await db.journal.findFirst({ where: { dateId } })

    if (!journal) throw new NotFoundError()

    return journal
  }
)
