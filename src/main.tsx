import { z } from "zod";
import { fromZodError } from "zod-validation-error";
// enum Hobies {
//   reading = "reading",
//   coding = "coding",
//   gaming = "gaming",
//   sleeping = "sleeping",
//   eating = "eating",
// }

const hobbies = ["reading", "coding", "gaming", "sleeping", "eating"] as const;
const UserSchema = z
  .object({
    // id :z.union([z.string(), z.number()]),
    id: z.discriminatedUnion("status", [
      z.object({
        status: z.literal("ok"),
        data: z.string(),
      }),
      z.object({
        status: z.literal("error"),
        error: z.instanceof(Error),
      }),
    ]),
    username: z
      .string()
      .min(3, "min length must be 3")
      .max(20, "max length must be 20"),
    age: z.number().gt(18),
    birthday: z.date(),
    isVerified: z.boolean(),
    symbol: z.symbol(),
    // hobby: z.enum(["reading", "coding", "gaming", "sleeping", "eating"]),
    // hobby: z.nativeEnum(Hobies),
    hobby: z.enum(hobbies),
  })
  .extend({
    name: z.string(),
    friends: z.array(z.string()).nonempty(),
    coords: z.tuple([z.string(), z.number().gt(10).int()]).rest(z.number()),
  });

type User = z.infer<typeof UserSchema>;

const user: User = {
  id: { status: "ok", data: "123456987" },
  username: "mahraur",
  age: 20,
  birthday: new Date(),
  isVerified: true,
  symbol: Symbol("test"),
  // hobby: "reading",
  // hobby: Hobies.coding,
  hobby: "reading",
  name: "Darshil",
  friends: ["Darshil", "Khushi"],
  coords: ["hey", 20, 9, 10, 11, 12],
};

// console.log(UserSchema.parse({ username: user.username, age: user.age }));
const userResult = UserSchema.safeParse(user);

if (!userResult.success) {
  console.log("error = ", fromZodError(userResult.error));
} else {
  console.log("data = ", userResult);
}

// console.log(
//   UserSchema.safeParse({
//     id: user.id,
//     username: user.username,
//     age: user.age,
//     birthday: user.birthday,
//     isVerified: user.isVerified,
//     symbol: user.symbol,
//     hobby: user.hobby,
//     name: user.name,
//     friends: user.friends,
//     coords: user.coords,
//   })
// );
// console.log(UserSchema.shape.age);
// console.log(UserSchema.partial().parse({ username: user.username }));

const UserRecord = z.record(z.string(), z.number());

const user1 = {
  id: 123456789,
  username: 45,
};

// console.log(UserRecord.parse(user1));

const userMap = z.map(z.string(), z.object({ name: z.string() }));
const user2 = new Map([
  ["1", { name: "Darshil" }],
  ["2", { name: "Khushi" }],
  ["3", { name: "Mahraur" }],
]);

// console.log(userMap.parse(user2));

//-----------------promise-----------------------

const PromiseSchema = z.promise(z.string());

const p = Promise.resolve("123456789");
// console.log(PromiseSchema.parse(p));

//----------------custom validation----------------

const bandEmail = z
  .string()
  .email()
  .refine((email) => email.endsWith("@dsce.edu.in"), {
    message: "email not accepted",
  });

const email = "tdxwest@dsce.edu.in";

// console.log(bandEmail.parse(email));
