# 💙 Blue Lui Personal Website (Cloudflare Worker + D1)

Personal portfolio website for Blue Lui (LUI Ying Lam) with contact form storage via D1 database.

## 🌐 Live URL

https://blue-lui-website.lbmkyi1.workers.dev/

## 🗄️ D1 Database

Contact form submissions are stored in the `contact_messages` table:

| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| email | TEXT |
| message | TEXT |
| created_at | DATETIME |

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form |
| `/api/messages` | GET | View all submissions (admin) |

## 🚀 Deployment

```bash
wrangler deploy
```
