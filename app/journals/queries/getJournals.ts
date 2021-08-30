import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetJournalsInput
  extends Pick<Prisma.JournalFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetJournalsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: journals,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.journal.count({ where }),
      query: (paginateArgs) => db.journal.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      journals,
      nextPage,
      hasMore,
      count,
    }
  }
)
