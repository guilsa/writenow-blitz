import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateJournal = z.object({
  content: z.string(),
  wordCount: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateJournal),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journal = await db.journal.create({
      data: { ...input, userId: ctx.session.userId },
    })

    return journal
  }
)
