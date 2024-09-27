import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from 'hono';

export const createNewBlog = async (c : Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const { title, content, userId } = await c.req.json();
  
    const blog = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: userId,
      },
    });
  
    return c.json({
      message: "blog created succesfully",
      blog,
    });
  }

  export const updateBlog = async (c : Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    const updatedBlog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
  
    return c.json({
      updatedBlog,
      message: "Blog updated succesfully",
    });
  }

  export const getBlogDetails = async (c : Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const id = c.req.param("id");
    const blog = await prisma.post.findFirst({
      where: { id },
      include : {
        author:true
      }
    });
  
    return c.json({
      blog,
    });
  }

  export const getAllBlogs = async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const blogs = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
  
    return c.json({ blogs });
  };
  
  export const deleteBlog = async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const { blogId } = c.req.param();
  
    try {
      const res = await prisma.post.delete({
        where: { id: blogId },
      });
      c.status(200);
      return c.json({ message: "blog deleted succesfully", res });
    } catch (error) {
      console.log(error);
    }
  }

  export const blogsSeeding = async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    try {
      const s = await prisma.post.createMany({
        data: body,
      });
  
      console.log(s);
      return c.json({ s });
    } catch (error) {
      console.log("reee", error);
      return c.json({ error });
    }
  }