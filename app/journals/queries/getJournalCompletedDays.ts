import { Ctx } from "blitz"
import db from "db"

export default async function getJournalCompletedDays(
  _ = null,
  { session }: Ctx
) {
  let results = Array()

  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
  })

  const journals = await db.journal.findMany({
    where: { userId: session.userId },
  })

  for (const journal of journals) {
    results.push(journal.dateId)
  }

  return results
}
