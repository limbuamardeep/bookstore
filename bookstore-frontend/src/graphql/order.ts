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

export const DELETE_ORDER = gql`
    mutation DeleteOrder($id: ID!) {
        deleteOrder(id: $id)
    }
`;

export const ADD_ORDER_ITEM = gql`
    mutation AddOrderItem($orderId: Int!, $bookId: Int!, $quantity: Int!, $price: Float!) {
        addOrderItem(orderId: $orderId, bookId: $bookId, quantity: $quantity, price: $price) {
            id
            orderId
            bookId
            quantity
            price
        }
    }
`;
