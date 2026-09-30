import { ApolloServer } from "@apollo/server"
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./prisma/schema.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import contractJson from "./prisma/schema.json" with { type: "json" };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

const prisma = postgres<Contract>({
    contractJson,
    url: databaseUrl,
})
const typeDefs=`#graphql
    type Author{
        id: ID!
        name: String!
        books: [Book!]!
    }
    type Book{
        id: ID!
        title: String!
        price: Float!
        publishYear: Int!
        author: Author!
    } 
    type Query{
        books: [Book!]!
        authors: [Author!]!

        book(id:ID!):Book
        author(id:ID!):Author
    }
    type Mutation{
        addAuthor(name:String!):Author!
        addBook(title:String!, price: Float!, publishYear: Int!, authorId: Int!): Book!
        #edit
        updateAuthor(id:ID!, name:String!): Author
        updateBook(id:ID!, title:String, price:Float, publishYear: Int, authorId: Int): Book
        #delete
        deleteAuthor(id:ID!):Boolean
        deleteBook(id:ID!):Boolean
    }
    `
const resolvers={
    Query:{
        books: async () => await prisma.orm.public.Book.include("author").all(),
        authors: async ()=>await prisma.orm.public.Author.include("books").all(),
        book: async (_: unknown, { id }: { id: string }) =>
            await prisma.orm.public.Book.include("author").where({ id: Number(id) }).first(),
        author: async (_: unknown, { id }: { id: string }) =>
            await prisma.orm.public.Author.include("books").where({ id: Number(id) }).first(),
    },
    Mutation:{
        addAuthor:async(_:unknown,{name}:{name:string})=>{
            const author=await prisma.orm.public.Author.create({name})
            return {...author,books:[]}
        },
        addBook:async(_:unknown,{title,price,publishYear,authorId}:{title:string,price:number,publishYear:number,authorId:number})=>{
            const book=await prisma.orm.public.Book.create({
                title,price,publishYear,authorId
            })
            return prisma.orm.public.Book.include("author").where({ id: book.id }).first();
        },
        updateAuthor:(_:unknown, {id,...changes}:{id:number})=>{
            prisma.orm.public.Author.where({id:Number(id)}).update(changes)
        },
        updateBook:(_:unknown,{id,...changes}:{id:number})=>{
            prisma.orm.public.Book.where({id:Number(id)}).update(changes)
        },
        deleteBook:async(_:unknown,{id}:{id:number})=>{
            (await prisma.orm.public.Book.where({id:Number(id)}).delete())!==null
        },
        deleteAuthor:async(_:unknown,{id}:{id:number})=>{
            (await prisma.orm.public.Author.where({id:Number(id)}).delete())!==null
        }
    }
}
const server=new ApolloServer({typeDefs,resolvers})
const {url}=await startStandaloneServer(server,{listen:{port:4000}})
console.log(`Bookstore api is ready at ${url}`)