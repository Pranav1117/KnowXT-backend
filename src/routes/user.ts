import { Hono } from "hono";
import { User } from "../controllers/index";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.get("/getuser", User.getUser);

userRouter.post("/signup", User.signUp);

userRouter.post("/signin", User.login);
