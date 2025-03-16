@echo off
echo Running React build...
cd front-end
npm run build

:: Check if the build process completed successfully
if %errorlevel% neq 0 (
    echo Build failed: React build did not complete successfully.
    exit /b %errorlevel%
)

:: Check if the build folder exists (just to be sure)
if not exist "build" (
    echo Build failed: 'build' folder not found.
    exit /b 1
)

echo Build completed successfully.
echo Starting the production server...

cd ..
:: Ensure the command runs correctly with 'call'
call npm run start:prod
