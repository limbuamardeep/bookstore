import { gql } from "@apollo/client";

export interface CategoriesQuery {
    categories: {
        id: string;
        name: string;
    }[];
}

export const GET_CATEGORIES = gql`
    query GetCategories {
        categories {
            id
            name
        }
    }
`;

export const ADD_CATEGORY = gql`
    mutation AddCategory($name: String!) {
        addCategory(name: $name) {
            id
            name
        }
    }
`;
