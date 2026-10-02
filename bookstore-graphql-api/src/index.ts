import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Temporal } from "@js-temporal/polyfill";
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./prisma/schema.js";
import contractJson from "./prisma/schema.json" with { type: "json" };

if (!("Temporal" in globalThis)) {
    Object.assign(globalThis, { Temporal });
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

const prisma = postgres<Contract>({ contractJson, url: databaseUrl });

const typeDefs = `#graphql
    enum UserRole {
        CUSTOMER
        ADMIN
    }

    enum OrderStatus {
        PENDING
        PAID
        SHIPPED
        CANCELLED
    }

    type Author {
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
        books: [Book!]!
    }

    type Category {
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
        books: [Book!]!
    }

    type Book {
        id: ID!
        title: String!
        description: String
        price: Float!
        stock: Int!
        imageUrl: String
        publishYear: Int!
        featured: Boolean!
        createdAt: String!
        updatedAt: String!
        authorId: Int!
        categoryId: Int
        author: Author!
        category: Category
        reviews: [Review!]!
        orderItems: [OrderItem!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        role: UserRole!
        createdAt: String!
        updatedAt: String!
        orders: [Order!]!
        reviews: [Review!]!
    }

    type Order {
        id: ID!
        total: Float!
        status: OrderStatus!
        createdAt: String!
        updatedAt: String!
        userId: Int!
        user: User!
        items: [OrderItem!]!
    }

    type OrderItem {
        id: ID!
        quantity: Int!
        price: Float!
        orderId: Int!
        bookId: Int!
        order: Order!
        book: Book!
    }

    type Review {
        id: ID!
        rating: Int!
        comment: String
        createdAt: String!
        updatedAt: String!
        userId: Int!
        bookId: Int!
        user: User!
        book: Book!
    }

    type Query {
        authors: [Author!]!
        author(id: ID!): Author
        categories: [Category!]!
        category(id: ID!): Category
        books: [Book!]!
        book(id: ID!): Book
        users: [User!]!
        user(id: ID!): User
        orders: [Order!]!
        order(id: ID!): Order
        orderItems: [OrderItem!]!
        orderItem(id: ID!): OrderItem
        reviews: [Review!]!
        review(id: ID!): Review
    }

    type Mutation {
        addAuthor(name: String!): Author!
        updateAuthor(id: ID!, name: String): Author
        deleteAuthor(id: ID!): Boolean!

        addCategory(name: String!): Category!
        updateCategory(id: ID!, name: String): Category
        deleteCategory(id: ID!): Boolean!

        addBook(title: String!, price: Float!, publishYear: Int!, authorId: Int!, description: String, stock: Int, imageUrl: String, featured: Boolean, categoryId: Int): Book!
        updateBook(id: ID!, title: String, description: String, price: Float, stock: Int, imageUrl: String, publishYear: Int, featured: Boolean, authorId: Int, categoryId: Int): Book
        deleteBook(id: ID!): Boolean!

        updateUser(id: ID!, name: String, email: String, role: UserRole): User
        deleteUser(id: ID!): Boolean!

        addOrder(userId: Int!, total: Float!, status: OrderStatus): Order!
        updateOrder(id: ID!, userId: Int, total: Float, status: OrderStatus): Order
        deleteOrder(id: ID!): Boolean!

        addOrderItem(orderId: Int!, bookId: Int!, quantity: Int!, price: Float!): OrderItem!
        updateOrderItem(id: ID!, orderId: Int, bookId: Int, quantity: Int, price: Float): OrderItem
        deleteOrderItem(id: ID!): Boolean!

        addReview(userId: Int!, bookId: Int!, rating: Int!, comment: String): Review!
        updateReview(id: ID!, rating: Int, comment: String): Review
        deleteReview(id: ID!): Boolean!
    }
`;

type IdArgs = { id: string };
type EntityParent = {
    id: number;
    authorId?: number;
    categoryId?: number | null;
    userId?: number;
    orderId?: number;
    bookId?: number;
    price?: number | string;
    total?: number | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
type UserRole = "CUSTOMER" | "ADMIN";
type InputData = Record<string, unknown>;

const definedValues = (data: InputData) =>
    Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
const asDateString = (value: Date | string | undefined) =>
    value instanceof Date ? value.toISOString() : String(value);
const decimalValues = (data: InputData) => {
    const values = definedValues(data);
    for (const field of ["price", "total"]) {
        if (typeof values[field] === "number") values[field] = String(values[field]);
    }
    return values;
};

const resolvers = {
    Query: {
        authors: () => prisma.orm.public.Author.all(),
        author: (_: unknown, { id }: IdArgs) => prisma.orm.public.Author.where({ id: Number(id) }).first(),
        categories: () => prisma.orm.public.Category.all(),
        category: (_: unknown, { id }: IdArgs) => prisma.orm.public.Category.where({ id: Number(id) }).first(),
        books: () => prisma.orm.public.Book.all(),
        book: (_: unknown, { id }: IdArgs) => prisma.orm.public.Book.where({ id: Number(id) }).first(),
        users: () => prisma.orm.public.User.all(),
        user: (_: unknown, { id }: IdArgs) => prisma.orm.public.User.where({ id: Number(id) }).first(),
        orders: () => prisma.orm.public.Order.all(),
        order: (_: unknown, { id }: IdArgs) => prisma.orm.public.Order.where({ id: Number(id) }).first(),
        orderItems: () => prisma.orm.public.OrderItem.all(),
        orderItem: (_: unknown, { id }: IdArgs) => prisma.orm.public.OrderItem.where({ id: Number(id) }).first(),
        reviews: () => prisma.orm.public.Review.all(),
        review: (_: unknown, { id }: IdArgs) => prisma.orm.public.Review.where({ id: Number(id) }).first(),
    },
    Author: {
        createdAt: (author: EntityParent) => asDateString(author.createdAt),
        updatedAt: (author: EntityParent) => asDateString(author.updatedAt),
        books: (author: EntityParent) => prisma.orm.public.Book.where({ authorId: author.id }).all(),
    },
    Category: {
        createdAt: (category: EntityParent) => asDateString(category.createdAt),
        updatedAt: (category: EntityParent) => asDateString(category.updatedAt),
        books: (category: EntityParent) => prisma.orm.public.Book.where({ categoryId: category.id }).all(),
    },
    Book: {
        price: (book: EntityParent) => Number(book.price),
        createdAt: (book: EntityParent) => asDateString(book.createdAt),
        updatedAt: (book: EntityParent) => asDateString(book.updatedAt),
        author: (book: EntityParent) => prisma.orm.public.Author.where({ id: book.authorId! }).first(),
        category: (book: EntityParent) =>
            book.categoryId == null ? null : prisma.orm.public.Category.where({ id: book.categoryId }).first(),
        reviews: (book: EntityParent) => prisma.orm.public.Review.where({ bookId: book.id }).all(),
        orderItems: (book: EntityParent) => prisma.orm.public.OrderItem.where({ bookId: book.id }).all(),
    },
    User: {
        createdAt: (user: EntityParent) => asDateString(user.createdAt),
        updatedAt: (user: EntityParent) => asDateString(user.updatedAt),
        orders: (user: EntityParent) => prisma.orm.public.Order.where({ userId: user.id }).all(),
        reviews: (user: EntityParent) => prisma.orm.public.Review.where({ userId: user.id }).all(),
    },
    Order: {
        total: (order: EntityParent) => Number(order.total),
        createdAt: (order: EntityParent) => asDateString(order.createdAt),
        updatedAt: (order: EntityParent) => asDateString(order.updatedAt),
        user: (order: EntityParent) => prisma.orm.public.User.where({ id: order.userId! }).first(),
        items: (order: EntityParent) => prisma.orm.public.OrderItem.where({ orderId: order.id }).all(),
    },
    OrderItem: {
        price: (item: EntityParent) => Number(item.price),
        order: (item: EntityParent) => prisma.orm.public.Order.where({ id: item.orderId! }).first(),
        book: (item: EntityParent) => prisma.orm.public.Book.where({ id: item.bookId! }).first(),
    },
    Review: {
        createdAt: (review: EntityParent) => asDateString(review.createdAt),
        updatedAt: (review: EntityParent) => asDateString(review.updatedAt),
        user: (review: EntityParent) => prisma.orm.public.User.where({ id: review.userId! }).first(),
        book: (review: EntityParent) => prisma.orm.public.Book.where({ id: review.bookId! }).first(),
    },
    Mutation: {
        addAuthor: (_: unknown, { name }: { name: string }) => prisma.orm.public.Author.create({ name }),
        updateAuthor: async (_: unknown, { id, ...data }: IdArgs & { name?: string }) => {
            await prisma.orm.public.Author.where({ id: Number(id) }).update(definedValues(data));
            return prisma.orm.public.Author.where({ id: Number(id) }).first();
        },
        deleteAuthor: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.Author.where({ id: Number(id) }).delete()) !== null,

        addCategory: (_: unknown, { name }: { name: string }) => prisma.orm.public.Category.create({ name }),
        updateCategory: async (_: unknown, { id, ...data }: IdArgs & { name?: string }) => {
            await prisma.orm.public.Category.where({ id: Number(id) }).update(definedValues(data));
            return prisma.orm.public.Category.where({ id: Number(id) }).first();
        },
        deleteCategory: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.Category.where({ id: Number(id) }).delete()) !== null,

        addBook: (
            _: unknown,
            { title, price, publishYear, authorId, description, stock, imageUrl, featured, categoryId }: {
                title: string;
                price: number;
                publishYear: number;
                authorId: number;
                description?: string | null;
                stock?: number;
                imageUrl?: string | null;
                featured?: boolean;
                categoryId?: number | null;
            },
        ) => prisma.orm.public.Book.create({
            title,
            price: String(price),
            publishYear,
            authorId,
            ...(description !== undefined && { description }),
            ...(stock !== undefined && { stock }),
            ...(imageUrl !== undefined && { imageUrl }),
            ...(featured !== undefined && { featured }),
            ...(categoryId !== undefined && { categoryId }),
        }),
        updateBook: async (_: unknown, { id, ...data }: IdArgs & InputData) => {
            await prisma.orm.public.Book.where({ id: Number(id) }).update(decimalValues(data));
            return prisma.orm.public.Book.where({ id: Number(id) }).first();
        },
        deleteBook: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.Book.where({ id: Number(id) }).delete()) !== null,

        updateUser: async (_: unknown, { id, ...data }: IdArgs & { name?: string; email?: string; role?: UserRole }) => {
            await prisma.orm.public.User.where({ id: Number(id) }).update(definedValues(data));
            return prisma.orm.public.User.where({ id: Number(id) }).first();
        },
        deleteUser: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.User.where({ id: Number(id) }).delete()) !== null,

        addOrder: (_: unknown, { userId, total, status }: { userId: number; total: number; status?: OrderStatus }) =>
            prisma.orm.public.Order.create({
                userId,
                total: String(total),
                ...(status !== undefined && { status }),
            }),
        updateOrder: async (_: unknown, { id, ...data }: IdArgs & { userId?: number; total?: number; status?: OrderStatus }) => {
            await prisma.orm.public.Order.where({ id: Number(id) }).update(decimalValues(data));
            return prisma.orm.public.Order.where({ id: Number(id) }).first();
        },
        deleteOrder: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.Order.where({ id: Number(id) }).delete()) !== null,

        addOrderItem: (_: unknown, { orderId, bookId, quantity, price }: { orderId: number; bookId: number; quantity: number; price: number }) =>
            prisma.orm.public.OrderItem.create({ orderId, bookId, quantity, price: String(price) }),
        updateOrderItem: async (_: unknown, { id, ...data }: IdArgs & InputData) => {
            await prisma.orm.public.OrderItem.where({ id: Number(id) }).update(decimalValues(data));
            return prisma.orm.public.OrderItem.where({ id: Number(id) }).first();
        },
        deleteOrderItem: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.OrderItem.where({ id: Number(id) }).delete()) !== null,

        addReview: (_: unknown, { userId, bookId, rating, comment }: { userId: number; bookId: number; rating: number; comment?: string | null }) =>
            prisma.orm.public.Review.create({
                userId,
                bookId,
                rating,
                ...(comment !== undefined && { comment }),
            }),
        updateReview: async (_: unknown, { id, ...data }: IdArgs & { rating?: number; comment?: string | null }) => {
            await prisma.orm.public.Review.where({ id: Number(id) }).update(definedValues(data));
            return prisma.orm.public.Review.where({ id: Number(id) }).first();
        },
        deleteReview: async (_: unknown, { id }: IdArgs) =>
            (await prisma.orm.public.Review.where({ id: Number(id) }).delete()) !== null,
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Bookstore API is ready at ${url}`);