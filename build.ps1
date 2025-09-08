# PowerShell build script for Windows
Write-Host "🚀 Starting optimized build process..." -ForegroundColor Green

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }

# Install dependencies with cache optimization
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm ci --prefer-offline --no-audit
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
}
catch {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Check for TypeScript errors
Write-Host "🔍 Checking TypeScript..." -ForegroundColor Cyan
try {
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { throw "TypeScript check failed" }
}
catch {
    Write-Host "❌ TypeScript check failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Lint code
Write-Host "✅ Linting code..." -ForegroundColor Magenta
try {
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw "Linting failed" }
}
catch {
    Write-Host "❌ Linting failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Build with optimizations
Write-Host "🏗️ Building with optimizations..." -ForegroundColor Green
try {
    $env:NODE_ENV = "production"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}
catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Analyze bundle size
Write-Host "📊 Analyzing bundle size..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Checking bundle size..." -ForegroundColor Cyan
    
    # Get JS files and their sizes
    $jsFiles = Get-ChildItem -Path ".next\static\chunks" -Filter "*.js" -ErrorAction SilentlyContinue
    if ($jsFiles) {
        $jsFiles | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
            $sizeKB = [math]::Round($_.Length / 1KB, 2)
            Write-Host "  $($_.Name): ${sizeKB} KB" -ForegroundColor White
        }
    } else {
        Write-Host "  No JS files found in chunks directory" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✨ Build optimization completed!" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
