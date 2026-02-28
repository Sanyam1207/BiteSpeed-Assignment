Bitespeed Identity Reconciliation API

This project implements an identity reconciliation system that links customer contacts across multiple purchases using email and phone number matching.

It ensures:
Consistent primary-secondary linking
Atomic database updates using transactions
Recursive cluster resolution
Production-ready architecture



Tech Stack

Node.js
Express
TypeScript
Prisma ORM
MySQL
Zod (Validation)
Express Rate Limiter



Project Structure
src/
│
├── config/         → Environment & Prisma configuration
├── controllers/    → Handles HTTP requests & responses
├── lib/            → Shared utilities
├── middlewares/    → Rate limiting & validation middleware
├── repository/     → Direct database interaction layer
├── routes/         → API route definitions
├── services/       → Core business logic (identity reconciliation)
├── validators/     → Zod schema validation
└── server.ts       → Entry point



Architecture Highlights
🔹 Clean Layered Architecture
Controller → Service → Repository → DB
Separation of concerns maintained


🔹 Transaction Support
All reconciliation logic is wrapped inside Prisma transactions to ensure atomicity.
If any step fails:
No partial updates occur
Database consistency is maintained


🔹 Recursive Cluster Resolution
Contacts are treated as a graph structure.
A BFS-based traversal ensures complete cluster resolution across multi-level linked contacts.


🔹 Security
Rate limiting enabled
Input validation using Zod


🔹 API Endpoint
POST /identify
Request Body

Request : 
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}


Response Format:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["primary@email.com", "secondary@email.com"],
    "phoneNumbers": ["123456", "999999"],
    "secondaryContactIds": [2, 3]
  }
}



🧪 Testing Examples
1️⃣ New User
{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}
2️⃣ Secondary Creation
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
3️⃣ Primary Merge Case
{
  "email": "george@hillvalley.edu",
  "phoneNumber": "717171"
}



⚙️ Local Setup
git clone <repo-url>
npm install
npx prisma migrate dev
npm run dev

Server runs on:

http://localhost:3000






__________________________________________________________________________________

Bhai simple language me bataun toh 👇

Ye project ek identity reconciliation system hai.

Matlab agar ek customer alag alag email aur phone se order kare,
toh system unko intelligently link karega.

Structure clean rakha hai:

Controller → Service → Repository → DB

Service layer me pura dimaag laga hai:

Recursive graph traversal

Primary-secondary linking

Merge handling

Idempotency

Transactions for safety

Sab DB operations transaction me wrapped hain.
Matlab agar beech me error aaye toh kuch bhi half update nahi hoga.

Validation Zod se ki hai.
Rate limiter bhi lagaya hai.
Indexes bhi add kiye hai performance ke liye.

Endpoint sirf ek hai:

POST /identify

Body me email ya phone bhejo.
Response me consolidated contact milta hai.

Deployment Render pe kiya hai.
Production ready architecture follow kiya hai.