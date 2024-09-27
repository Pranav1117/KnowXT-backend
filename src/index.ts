import { Hono } from "hono";
import { cors } from "hono/cors";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blogs";

// Defining types for env file this is how u tell hono types of env
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;