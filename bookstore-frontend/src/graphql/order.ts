import { gql } from "@apollo/client";

export interface OrdersQuery {
    orders: {
        id: string;
        userId: number;
        total: number;
        status: string;
    }[];
}

export const GET_ORDERS = gql`
    query GetOrders {
        orders {
            id
            userId
            total
            status
        }
    }
`;

export const ADD_ORDER = gql`
    mutation AddOrder($userId: Int!, $total: Float!, $status: OrderStatus) {
        addOrder(userId: $userId, total: $total, status: $status) {
            id
            userId
            total
            status
        }
    }
`;
