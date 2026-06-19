{
  "version": 2,
  "builds": [
    { "src": "backend/server.js", "use": "@vercel/node" },
    { "src": "frontend/index.html", "use": "@vercel/static" },
    { "src": "frontend/css/style.css", "use": "@vercel/static" },
    { "src": "frontend/js/app.js", "use": "@vercel/static" },
    { "src": "frontend/js/auth.js", "use": "@vercel/static" },
    { "src": "frontend/js/tasks.js", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/server.js" },
    { "src": "/css/style.css", "dest": "frontend/css/style.css" },
    { "src": "/js/app.js", "dest": "frontend/js/app.js" },
    { "src": "/js/auth.js", "dest": "frontend/js/auth.js" },
    { "src": "/js/tasks.js", "dest": "frontend/js/tasks.js" },
    { "src": "/(.*)", "dest": "frontend/index.html" }
  ]
}