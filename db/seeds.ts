import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  await db.journal.create({
    data: {
      content: "This is the first post!",
      userId: 1,
      wordCount: 5,
      dateId: "2021-08-31",
    },
  })
  // }
}

export default seed
