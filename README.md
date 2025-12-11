Digital Menu System – OTP Authentication Flow
🚀 Live Deployment

Production URL: [https://your-vercel-domain.vercel.app](https://digital-menu-system-git-master-vaibhavs-projects-8bda4f52.vercel.app?_vercel_share=RD52ioLJWo4xYbVA2tQaze4lEV3PErCJ)

📌 Overview

This project implements a secure OTP-based authentication system using Next.js (App Router), tRPC, Prisma, Resend for emails, and Vercel.
The focus of the assignment was to design a clean login and verification flow with OTP delivery and verification using hashed OTPs stored in the database.

The application includes:

1.Email-based login (for testing use s@g.com)

2.OTP generation using secure random codes (Currently to obtain OTP please check the console.log as for email, we had no domain to link to but it is integrated)

3.OTP hashing using bcrypt

4.Cookie-based session auth

5.Server actions for secure cookie management

6.Protected dashboard page

7.Vercel-ready deployment

Approach & Architecture Key Decisions

1.Used tRPC for type-safe request handling and server logic.

2.Created a dedicated OTP table with hashed OTP and expiry timestamps.

3.Used bcrypt.hash() to securely store OTP instead of plaintext.

4.Used Resend for sending verification emails.

5.Used Next.js Server Actions to set encrypted httpOnly cookies.

6.Separated Client and Server Components to avoid Suspense + prerendering errors.

7.Handled OTP expiry to avoid invalid login attempts.

High-Level Flow:
Step	User Action	System Action
1	User enters email	Generate & hash OTP → Save in DB → Email OTP
2	User enters OTP	Validate code → Set secure cookie
3	User accesses dashboard	Cookie-based authentication

IDE Used: Visual Studio Code (VS Code)

AI Tools and Models Used: ChatGPT (GPT-5.1)/GitHub Copilot (light usage)

Prompts Used with AI Tools :- 

Some examples of prompts used:

“Fix Suspense error: useSearchParams() should be wrapped in a suspense boundary.”

“Refactor my login and verify pages to avoid server/client rendering conflicts and smooth scalability.”

Helpfulness of AI Tools

AI was extremely helpful for:

Debugging cookie behavior in production vs. local.

Mistakes the AI made (which I corrected):

Suggested importing Client Component inside a Server Component incorrectly.

Some syntax and syntactical errors. 

🧩 Edge Cases Handled

These were not explicitly mentioned in the assignment but were implemented:
OTP Expiry: Rejecting OTPs older than 5 minutes.
Multiple OTP Requests: Generating new OTP invalidates the old one automatically.
Incorrect OTP: Safe error message without revealing specific failure details.
Email validation via Zod.

Would add:

Proper image storage
Logging & Monitoring
Resend Email Preview in Production


📄 Summary

This project demonstrates a secure, modern implementation of OTP-based authentication using Next.js App Router, server actions, Prisma, and Vercel.
A clean architecture was followed, with careful separation of client/server logic and production-ready cookie handling.
