import { Hono } from "hono";
import { Blogs } from "../controllers/index";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// auth middleware
// blogRouter.use("/*", async (c, next) => {
//   const jwt = c.req.header("Authorization");

//   if (!jwt) {
//     c.status(403);
//     return c.json({ error: "unauthorized" });
//   }
//   const token = jwt.split(" ")[1];
//   const payload = await verify(token, c.env.JWT_SECRET);
//   if (!payload) {
//     c.status(403);
//     return c.json({ error: "unauthorized" });
//   }
//   console.log(typeof payload.id)

//   if (!payload || typeof payload.id !== "string") {
//     c.status(403);
//     return c.json({ error: "unauthorized" });
//   }

//   c.set("userId", payload.id);

//   await next();
// });

// route for posting blog
blogRouter.post("/", Blogs.createNewBlog);

// route fot updating certain blog
blogRouter.patch("/updateblog",Blogs.updateBlog);

// route for getting details for particualr blog
blogRouter.get("/details/:id", Blogs.getBlogDetails);

// route for getting all blogs
blogRouter.get("/all", Blogs.getAllBlogs);

blogRouter.delete("/deleteblog/:blogId",Blogs.deleteBlog);

blogRouter.post("/seed", Blogs.blogsSeeding);
