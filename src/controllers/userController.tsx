import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { Context } from "hono";
import { sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }>();

export const getUser = async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
      
    const head = c.req.header();
  
    const token = head.authorization.split(" ")[1];
    const verifiedToken = await verify(token, c.env.JWT_SECRET)
  
    const user = await prisma.user.findFirst({
      where :{
        // @ts-ignore
        id : verifiedToken.id
      }
    });
    return c.json({
      user,
    });
  }

  export const signUp =  async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const { email, username, password } = await c.req.json();
  
    const userAlreadyExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (userAlreadyExist) {
      c.status(409);
      return c.json({
        message: "User already exists",
      });
    }
    try {
      const user = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: password,
        },
      });
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  
      return c.json({
        token: jwt,
        user,
      });
    } catch (err) {
      return c.json({ message: "something went wrong" });
    }
  }

  export const login = async (c: Context) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const { email, password } = await c.req.json();
  
    const user = await prisma.user.findFirst({
      where: { email },
    });
  
    if (!user) {
      c.status(404);
      return c.json({
        message: "User does not exists",
      });
    }
  
    const passVerified = password == user.password;
  
    if (!passVerified) {
      c.status(400);
      return c.json({
        message: "password does not match",
      });
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  
    return c.json({
      token,
      message: "Login success",
    });
  }