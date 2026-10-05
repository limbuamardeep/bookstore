import { gql } from "@apollo/client";

export interface UsersQuery {
    users: {
        id: string;
        name: string;
        email: string;
        role: string;
    }[];
}

export const GET_USERS = gql`
    query GetUsers {
        users {
            id
            name
            email
            role
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;
