# 🧑‍💻 StudyMate: A Social Learning Platform

StudyMate is a modern social platform designed to connect students who are looking for study partners. Users can easily find collaborators based on their **preferred subject, educational level, location, or desired mode (online/offline)**. It is a social platform strictly dedicated to academics and studying.

### Backend (Server)

| Technology             | Purpose                                      |
| :--------------------- | :------------------------------------------- |
| **Node.js + Express**  | Building a scalable and fast RESTful API     |
| **MongoDB + Mongoose** | Database management and schema modeling      |
| **Firebase Admin SDK** | User token verification and API security     |
| **CORS**               | Security and environment variable management |

---

## ⚙️ Server API Endpoints (Key Functionality)

| Method   | Endpoint                  | Purpose                                  |
| :------- | :------------------------ | :--------------------------------------- |
| `POST`   | `/partners`               | Create a new partner profile             |
| `GET`    | `/partners`               | Fetch all profiles (with search/sorting) |
| `GET`    | `/partners/top`           | Fetch top 3 partners (for homepage)      |
| `PATCH`  | `/partners/:id/increment` | Increment the partner count by +1        |
| `GET`    | `/my-requests?email=...`  | Fetch all requests for a specific user   |
| `POST`   | `/requests`               | Send a new partner request               |
| `PATCH`  | `/requests/:id`           | Update the request status                |
| `DELETE` | `/requests/:id`           | Delete a request                         |

---

## 🚀 Project Execution Summary

The project was completed following a clear, phased development plan, resulting in the following Git activity:
