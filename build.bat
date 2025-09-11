@echo off
echo Starting optimized build process...

REM Clean previous builds
echo Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Install dependencies with cache optimization
echo Installing dependencies...
call npm ci --prefer-offline --no-audit
if %errorlevel% neq 0 (
    echo Failed to install dependencies!
    exit /b %errorlevel%
)

REM Check for TypeScript errors
echo Checking TypeScript...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo TypeScript check failed!
    exit /b %errorlevel%
)

REM Lint code
echo  Linting code...
call npm run lint
if %errorlevel% neq 0 (
    echo Linting failed!
    exit /b %errorlevel%
)

REM Build with optimizations
echo Building with optimizations...
set NODE_ENV=production
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)

REM Analyze bundle size
echo Analyzing bundle size...
if exist .next (
    echo Build completed successfully!
    echo Checking bundle size...
    dir .next\static\chunks\*.js /s
) else (
    echo Build failed!
    exit /b 1
)

echo Build optimization completed!
pause
