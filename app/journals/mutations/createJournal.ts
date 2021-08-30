import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateJournal = z.object({
  content: z.string(),
})

export default resolver.pipe(resolver.zod(CreateJournal), resolver.authorize(), async (input) => {
  console.log("input", input)

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const journal = await db.journal.create({ data: { ...input, userId: 1 } })

  return journal
})
