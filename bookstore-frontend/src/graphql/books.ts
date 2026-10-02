import { gql } from "@apollo/client";

export interface BooksQuery {
    books: {
        id: string;
        title: string;
        price: number;
        stock: number;
        imageUrl: string | null;
        featured: boolean;
        publishYear: number;
        description: string | null;
        authorId: number;
        categoryId: number | null;
        author: { name: string };
        category: { name: string } | null;
        reviews: { rating: number }[];
    }[];
}

export const GET_BOOKS = gql`
    query GetBooks {
        books {
            id
            title
            price
            stock
            imageUrl
            featured
            publishYear
            description
            authorId
            categoryId
            author {
                name
            }
            category {
                name
            }
            reviews {
                rating
            }
        }
    }
`;
export const ADD_BOOK = gql`
    mutation AddBook(
        $title: String!
        $price: Float!
        $publishYear: Int!
        $authorId: Int!
        $description: String
        $stock: Int
        $imageUrl: String
        $featured: Boolean
        $categoryId: Int
    ) {
        addBook(
            title: $title
            price: $price
            publishYear: $publishYear
            authorId: $authorId
            description: $description
            stock: $stock
            imageUrl: $imageUrl
            featured: $featured
            categoryId: $categoryId
        ) {
            id
            title
            price
            stock
            publishYear
            featured
            author {
                name
            }
        }
    }
`;

export const UPDATE_BOOK = gql`
    mutation UpdateBook(
        $id: ID!
        $title: String
        $price: Float
        $stock: Int
        $featured: Boolean
        $description: String
        $imageUrl: String
        $publishYear: Int
        $authorId: Int
        $categoryId: Int
    ) {
        updateBook(
            id: $id
            title: $title
            price: $price
            stock: $stock
            featured: $featured
            description: $description
            imageUrl: $imageUrl
            publishYear: $publishYear
            authorId: $authorId
            categoryId: $categoryId
        ) {
            id
            title
            price
            stock
            featured
            publishYear
            description
            imageUrl
            authorId
            categoryId
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
    }
`;

export const GET_BOOK = gql`
    query GetBook($id: ID!) {
        book(id: $id) {
            id
            title
            price
            stock
            imageUrl
            featured
            publishYear
            description
            author {
                name
            }
            category {
                name
            }
            reviews {
                id
                rating
                comment
                user {
                    name
                }
            }
        }
    }
`;
