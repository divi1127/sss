@echo off
echo Installing server dependencies...
cd /d "%~dp0server"
call npm install
echo Starting server...
start "Server" cmd /c "node index.js"

echo Installing client dependencies...
cd /d "%~dp0client"
call npm install
echo Starting client...
start "Client" cmd /c "npx vite --host"

echo.
echo ========================================
echo  Setup Instructions:
echo ========================================
echo  1. Make sure MySQL is running
echo  2. The server will auto-create the database on first run
echo  3. Once server is running, visit:
echo     http://localhost:3000 (Client - React)
echo     http://localhost:5000/api/health (Server health check)
echo  4. Seed the admin user:
echo     In a browser, visit:
echo     http://localhost:5000/api/auth/seed
echo     This creates: admin@vesselwash.com / admin123
echo  5. Access admin panel at:
echo     http://localhost:3000/admin
echo ========================================
pause
