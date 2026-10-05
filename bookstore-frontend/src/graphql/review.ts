import { gql } from "@apollo/client";

export interface ReviewsQuery {
    reviews: {
        id: string;
        userId: number;
        bookId: number;
        rating: number;
        comment: string | null;
    }[];
}

export const GET_REVIEWS = gql`
    query GetReviews {
        reviews {
            id
            userId
            bookId
            rating
            comment
        }
    }
`;

export const ADD_REVIEW = gql`
    mutation AddReview($userId: Int!, $bookId: Int!, $rating: Int!, $comment: String) {
        addReview(userId: $userId, bookId: $bookId, rating: $rating, comment: $comment) {
            id
            userId
            bookId
            rating
            comment
        }
    }
`;

export const DELETE_REVIEW = gql`
    mutation DeleteReview($id: ID!) {
        deleteReview(id: $id)
    }
`;
