import type { Book, Order, User, Review } from '../types';

export const mockCategories = [
  "Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Biography",
  "Self Development",
  "History",
  "Children's Books"
];

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    price: 24.99,
    rating: 4.8,
    reviewCount: 342,
    stock: 15,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    isbn: "9780525559474",
    publisher: "Viking",
    publicationDate: "2020-09-29",
    language: "English",
    format: "Hardcover",
    pages: 304,
    dimensions: "6 x 9 inches",
    status: "Published",
    createdAt: "2023-10-01"
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    price: 19.99,
    discountPrice: 14.99,
    rating: 4.9,
    reviewCount: 890,
    stock: 42,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
    isbn: "9780441172719",
    publisher: "Ace Books",
    publicationDate: "1965-08-01",
    language: "English",
    format: "Paperback",
    pages: 412,
    dimensions: "5.5 x 8.2 inches",
    status: "Published",
    createdAt: "2023-09-15"
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    price: 27.00,
    rating: 4.7,
    reviewCount: 1250,
    stock: 100,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
    isbn: "9780735211292",
    publisher: "Avery",
    publicationDate: "2018-10-16",
    language: "English",
    format: "Hardcover",
    pages: 320,
    dimensions: "6 x 9 inches",
    status: "Published",
    createdAt: "2023-11-05"
  },
  {
    id: "4",
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    price: 28.99,
    rating: 4.9,
    reviewCount: 650,
    stock: 8,
    coverImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    isbn: "9780593135204",
    publisher: "Ballantine Books",
    publicationDate: "2021-05-04",
    language: "English",
    format: "Hardcover",
    pages: 496,
    dimensions: "6.2 x 9.5 inches",
    status: "Published",
    createdAt: "2023-12-10"
  },
  {
    id: "5",
    title: "Becoming",
    author: "Michelle Obama",
    category: "Biography",
    price: 32.50,
    discountPrice: 25.00,
    rating: 4.8,
    reviewCount: 2100,
    stock: 0,
    coverImage: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=600&auto=format&fit=crop",
    description: "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era.",
    isbn: "9781524763138",
    publisher: "Crown Publishing Group",
    publicationDate: "2018-11-13",
    language: "English",
    format: "Hardcover",
    pages: 448,
    dimensions: "6.5 x 9.5 inches",
    status: "Out of Stock",
    createdAt: "2023-08-20"
  },
  {
    id: "6",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    category: "Romance",
    price: 17.00,
    rating: 4.6,
    reviewCount: 890,
    stock: 25,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
    isbn: "9781501161933",
    publisher: "Atria Books",
    publicationDate: "2017-06-13",
    language: "English",
    format: "Paperback",
    pages: 400,
    dimensions: "5.3 x 8.2 inches",
    status: "Published",
    createdAt: "2024-01-12"
  }
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Customer",
    status: "Active",
    joinedDate: "2023-01-15"
  },
  {
    id: "u2",
    name: "Admin User",
    email: "admin@store.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2022-11-01"
  },
  {
    id: "u3",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Customer",
    status: "Inactive",
    joinedDate: "2023-05-22"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD-7392",
    customerId: "u1",
    customerName: "Alice Johnson",
    date: "2024-02-14",
    items: [
      { bookId: "1", title: "The Midnight Library", quantity: 1, price: 24.99 },
      { bookId: "3", title: "Atomic Habits", quantity: 1, price: 27.00 }
    ],
    amount: 51.99,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered"
  },
  {
    id: "ORD-8401",
    customerId: "u3",
    customerName: "Bob Smith",
    date: "2024-03-01",
    items: [
      { bookId: "2", title: "Dune", quantity: 2, price: 14.99 }
    ],
    amount: 29.98,
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing"
  }
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    bookId: "1",
    userId: "u1",
    userName: "Alice Johnson",
    rating: 5,
    comment: "Absolutely loved this book! It made me think about all the choices I've made in life.",
    date: "2023-11-20",
    helpfulCount: 24
  },
  {
    id: "r2",
    bookId: "1",
    userId: "u3",
    userName: "Bob Smith",
    rating: 4,
    comment: "Great concept, though the middle dragged a little bit. Still highly recommended.",
    date: "2023-12-05",
    helpfulCount: 8
  }
];
