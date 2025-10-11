# PowerShell API Testing Script for Gymbite Backend
# Run this script to test all endpoints

# Configuration
$BaseUrl = "https://gymbite-backend.vercel.app"
$Token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1YTAwNWU5N2NiMWU0MjczMDBlNTJjZGQ1MGYwYjM2Y2Q4MDYyOWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3ltYml0ZSIsImF1ZCI6Imd5bWJpdGUiLCJhdXRoX3RpbWUiOjE3NjAyMTM0NTAsInVzZXJfaWQiOiJCM1FzOXZpYWdIVDJDR3hqWmFnbk9iR3JFK2QyIiwic3ViIjoiQjNRczl2aWFnSFQyQ0d4alphZ25PYkdyRUtkMiIsImlhdCI6MTc2MDIxMzQ1MCwiZXhwIjoxNzYwMjE3MDUwLCJlbWFpbCI6InRlc3RhZG1pbkBneW1iaXRlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0YWRtaW5AZ3ltYml0ZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.NM3-Hmi9GkL-omtRDZuCOdkA1eg6UznRpXxPYhM-qCFZkOQyhcHjX0SL36za5T7FAK4aLr7heXT7J762ZoHExPoGp6x0rXakCaJ5xN8Gfh07UUaKvZBKknjJxjcCMdebYQL8i1wy_OZvqD-OnopLxpJlL_w92VhLqY19guqgNbyJx417zF0zqLq_Ov89wsQV3c0vI00w6uIsBFSQAU4p7RYl_O9NrhrCeSk83crQ0KR2zo6OF6rpyndcibjKPBxvthS2wz0uuxaLFWbcfrunWaJ8UK11O13VUgq9xnYuXR-8pHrvtYOIixq6TQxQIjGs-EiLOyqZx6Yp6xe3TLWjCg"

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "🧪 Testing Gymbite Backend API" -ForegroundColor Green
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "=" * 50

# Test 1: Health Check
Write-Host "`n1️⃣ Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "$BaseUrl/api/health" -Method GET -Headers $Headers
    Write-Host "✅ Health Check: " -ForegroundColor Green -NoNewline
    Write-Host $healthResponse.Content
} catch {
    Write-Host "❌ Health Check Failed: " -ForegroundColor Red -NoNewline
    Write-Host $_.Exception.Message
}

# Test 2: Get All Meal Plans
Write-Host "`n2️⃣ Testing Get All Meal Plans..." -ForegroundColor Cyan
try {
    $mealPlansResponse = Invoke-WebRequest -Uri "$BaseUrl/api/meal-plans" -Method GET -Headers $Headers
    Write-Host "✅ Get Meal Plans: " -ForegroundColor Green -NoNewline
    Write-Host $mealPlansResponse.Content
} catch {
    Write-Host "❌ Get Meal Plans Failed: " -ForegroundColor Red -NoNewline
    Write-Host $_.Exception.Message
}

# Test 3: Create Meal Plan
Write-Host "`n3️⃣ Testing Create Meal Plan..." -ForegroundColor Cyan
$createMealPlanBody = @{
    title = "Test High Protein Plan"
    description = "A test meal plan for high protein intake"
    category = "muscle_building"
    imageUrl = "https://example.com/test-image.jpg"
    meals = @(
        @{
            name = "Test Protein Breakfast"
            description = "High protein breakfast"
            calories = 450
            protein = 35
            carbs = 30
            fat = 18
            ingredients = @("3 eggs", "2 slices bread", "Greek yogurt")
            instructions = "Cook eggs, toast bread, serve with yogurt"
            mealType = "breakfast"
            preparationTime = 15
            imageUrl = "https://example.com/breakfast.jpg"
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-WebRequest -Uri "$BaseUrl/api/meal-plans" -Method POST -Headers $Headers -Body $createMealPlanBody
    Write-Host "✅ Create Meal Plan: " -ForegroundColor Green -NoNewline
    Write-Host $createResponse.Content
    
    # Extract meal plan ID for further tests
    $mealPlan = $createResponse.Content | ConvertFrom-Json
    $mealPlanId = $mealPlan.id
    Write-Host "📝 Created Meal Plan ID: $mealPlanId" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Create Meal Plan Failed: " -ForegroundColor Red -NoNewline
    Write-Host $_.Exception.Message
}

# Test 4: Get Specific Meal Plan (if we have an ID)
if ($mealPlanId) {
    Write-Host "`n4️⃣ Testing Get Specific Meal Plan..." -ForegroundColor Cyan
    try {
        $specificMealPlan = Invoke-WebRequest -Uri "$BaseUrl/api/meal-plans/$mealPlanId" -Method GET -Headers $Headers
        Write-Host "✅ Get Specific Meal Plan: " -ForegroundColor Green -NoNewline
        Write-Host $specificMealPlan.Content
    } catch {
        Write-Host "❌ Get Specific Meal Plan Failed: " -ForegroundColor Red -NoNewline
        Write-Host $_.Exception.Message
    }
}

# Test 5: Get Meals for Meal Plan
if ($mealPlanId) {
    Write-Host "`n5️⃣ Testing Get Meals for Meal Plan..." -ForegroundColor Cyan
    try {
        $mealsResponse = Invoke-WebRequest -Uri "$BaseUrl/api/meals/meal-plan/$mealPlanId/meals" -Method GET -Headers $Headers
        Write-Host "✅ Get Meals: " -ForegroundColor Green -NoNewline
        Write-Host $mealsResponse.Content
    } catch {
        Write-Host "❌ Get Meals Failed: " -ForegroundColor Red -NoNewline
        Write-Host $_.Exception.Message
    }
}

Write-Host "`n🏁 API Testing Complete!" -ForegroundColor Green
Write-Host "=" * 50