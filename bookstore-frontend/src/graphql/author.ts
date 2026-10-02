import { gql } from "@apollo/client";

export interface AuthorsQuery {
    authors: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        books: { id: string; title: string }[];
    }[];
}

export const GET_AUTHORS = gql`
    query GetAuthors {
        authors {
            id
            name
            createdAt
            updatedAt
            books {
                id
                title
            }
        }
    }
`;

export const ADD_AUTHOR = gql`
    mutation AddAuthor($name: String!) {
        addAuthor(name: $name) {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($id: ID!, $name: String!) {
        updateAuthor(id: $id, name: $name) {
            id
            name
        }
    }
`;

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: ID!) {
        deleteAuthor(id: $id)
    }
`;
