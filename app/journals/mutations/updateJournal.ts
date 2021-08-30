import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateJournal = z.object({
  id: z.number(),
  content: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateJournal),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journal = await db.journal.update({ where: { id }, data })

    return journal
  }
)
