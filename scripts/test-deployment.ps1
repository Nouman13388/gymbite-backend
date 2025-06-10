# GymBite Backend Deployment Test Script
# Replace YOUR_DEPLOYMENT_URL with your actual Vercel deployment URL

$deploymentUrl = "https://your-deployment-url.vercel.app"

Write-Host "🚀 Testing GymBite Backend Deployment" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Testing basic endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$deploymentUrl/"
    Write-Host "✅ Basic endpoint working!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Basic endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing health check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$deploymentUrl/api/health"
    Write-Host "✅ Health check working!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing users endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$deploymentUrl/api/users"
    Write-Host "✅ Users endpoint working!" -ForegroundColor Green
    Write-Host "Found $($response.Count) users" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Users endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing trainers endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$deploymentUrl/api/trainers"
    Write-Host "✅ Trainers endpoint working!" -ForegroundColor Green
    Write-Host "Found $($response.Count) trainers" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Trainers endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Testing clients endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$deploymentUrl/api/clients"
    Write-Host "✅ Clients endpoint working!" -ForegroundColor Green
    Write-Host "Found $($response.Count) clients" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Clients endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Deployment test completed!" -ForegroundColor Green
Write-Host "Replace the deployment URL above with your actual URL and run this script." -ForegroundColor Yellow
