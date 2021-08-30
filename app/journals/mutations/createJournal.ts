import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateJournal = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateJournal), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const journal = await db.journal.create({ data: input })

  return journal
})
