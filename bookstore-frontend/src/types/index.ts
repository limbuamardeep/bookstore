export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  coverImage: string;
  description: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  language: string;
  format: string;
  pages: number;
  dimensions: string;
  status: 'Published' | 'Draft' | 'Out of Stock';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Customer';
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: { bookId: string; title: string; quantity: number; price: number }[];
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  fulfillmentStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}
