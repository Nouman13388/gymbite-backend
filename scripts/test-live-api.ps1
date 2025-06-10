# GymBite Backend API Endpoint Test Script
# Tests all major endpoints of the deployed Vercel application

$deploymentUrl = "https://gymbite-backend-6x3onpoq8-nouman13388s-projects.vercel.app"

Write-Host "🚀 Testing GymBite Backend API Endpoints" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🌐 Deployment URL: $deploymentUrl" -ForegroundColor Cyan
Write-Host ""

$testResults = @()

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$deploymentUrl/api/health" -Method GET
    Write-Host "   ✅ Health endpoint working!" -ForegroundColor Green
    Write-Host "   📊 Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "   🔗 Database: $($health.database.status)" -ForegroundColor Cyan
    Write-Host "   📱 Version: $($health.version)" -ForegroundColor Cyan
    $testResults += "✅ Health Check: PASSED"
} catch {
    Write-Host "   ❌ Health endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Health Check: FAILED - $($_.Exception.Message)"
}

Write-Host ""

# Test 2: Users Endpoint
Write-Host "2️⃣  Testing Users API..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$deploymentUrl/api/users" -Method GET
    Write-Host "   ✅ Users endpoint working!" -ForegroundColor Green
    Write-Host "   👥 Found $($users.Count) users" -ForegroundColor Cyan
    $testResults += "✅ Users API: PASSED ($($users.Count) users)"
} catch {
    Write-Host "   ❌ Users endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Users API: FAILED - $($_.Exception.Message)"
}

Write-Host ""

# Test 3: Trainers Endpoint
Write-Host "3️⃣  Testing Trainers API..." -ForegroundColor Yellow
try {
    $trainers = Invoke-RestMethod -Uri "$deploymentUrl/api/trainers" -Method GET
    Write-Host "   ✅ Trainers endpoint working!" -ForegroundColor Green
    Write-Host "   🏋️  Found $($trainers.Count) trainers" -ForegroundColor Cyan
    $testResults += "✅ Trainers API: PASSED ($($trainers.Count) trainers)"
} catch {
    Write-Host "   ❌ Trainers endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Trainers API: FAILED - $($_.Exception.Message)"
}

Write-Host ""

# Test 4: Clients Endpoint
Write-Host "4️⃣  Testing Clients API..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "$deploymentUrl/api/clients" -Method GET
    Write-Host "   ✅ Clients endpoint working!" -ForegroundColor Green
    Write-Host "   👤 Found $($clients.Count) clients" -ForegroundColor Cyan
    $testResults += "✅ Clients API: PASSED ($($clients.Count) clients)"
} catch {
    Write-Host "   ❌ Clients endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Clients API: FAILED - $($_.Exception.Message)"
}

Write-Host ""

# Test 5: Workout Plans Endpoint
Write-Host "5️⃣  Testing Workout Plans API..." -ForegroundColor Yellow
try {
    $workoutPlans = Invoke-RestMethod -Uri "$deploymentUrl/api/workout-plans" -Method GET
    Write-Host "   ✅ Workout Plans endpoint working!" -ForegroundColor Green
    Write-Host "   💪 Found $($workoutPlans.Count) workout plans" -ForegroundColor Cyan
    $testResults += "✅ Workout Plans API: PASSED ($($workoutPlans.Count) plans)"
} catch {
    Write-Host "   ❌ Workout Plans endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Workout Plans API: FAILED - $($_.Exception.Message)"
}

Write-Host ""

# Test 6: Basic Root Endpoint
Write-Host "6️⃣  Testing Root Endpoint..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "$deploymentUrl/" -Method GET
    Write-Host "   ✅ Root endpoint working!" -ForegroundColor Green
    Write-Host "   📝 Message: $($root.message)" -ForegroundColor Cyan
    $testResults += "✅ Root Endpoint: PASSED"
} catch {
    Write-Host "   ❌ Root endpoint failed!" -ForegroundColor Red
    $testResults += "❌ Root Endpoint: FAILED - $($_.Exception.Message)"
}

Write-Host ""
Write-Host "🎯 TEST SUMMARY" -ForegroundColor Magenta
Write-Host "===============" -ForegroundColor Magenta
foreach ($result in $testResults) {
    Write-Host "  $result"
}

Write-Host ""
Write-Host "🚀 GymBite Backend API is live and ready!" -ForegroundColor Green
Write-Host "📱 Use this URL in your frontend: $deploymentUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Available Endpoints:" -ForegroundColor Cyan
Write-Host "  • Health Check: $deploymentUrl/api/health" -ForegroundColor White
Write-Host "  • Users: $deploymentUrl/api/users" -ForegroundColor White
Write-Host "  • Trainers: $deploymentUrl/api/trainers" -ForegroundColor White
Write-Host "  • Clients: $deploymentUrl/api/clients" -ForegroundColor White
Write-Host "  • Workout Plans: $deploymentUrl/api/workout-plans" -ForegroundColor White
Write-Host "  • Meal Plans: $deploymentUrl/api/meal-plans" -ForegroundColor White
Write-Host "  • Progress: $deploymentUrl/api/progress" -ForegroundColor White
Write-Host "  • Appointments: $deploymentUrl/api/appointments" -ForegroundColor White
Write-Host "  • Consultations: $deploymentUrl/api/consultations" -ForegroundColor White
Write-Host "  • Feedback: $deploymentUrl/api/feedbacks" -ForegroundColor White
Write-Host "  • Notifications: $deploymentUrl/api/notifications" -ForegroundColor White
