// Sample data population script for Gymbite API
// Run this script to populate the database with sample client, trainer, and meal plan data

const API_BASE = 'https://gymbite-backend.vercel.app/api';

// Put your actual Bearer token here (get from: npm run get-token testadmin@gymbite.com 12345678)
const authToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1YTAwNWU5N2NiMWU0MjczMDBlNTJjZGQ1MGYwYjM2Y2Q4MDYyOWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3ltYml0ZSIsImF1ZCI6Imd5bWJpdGUiLCJhdXRoX3RpbWUiOjE3NjAyMTM0NTAsInVzZXJfaWQiOiJCM1FzOXZpYWdIVDJDR3hqWmFnbk9iR3JFK2QyIiwic3ViIjoiQjNRczl2aWFnSFQyQ0d4alphZ25PYkdyRUtkMiIsImlhdCI6MTc2MDIxMzQ1MCwiZXhwIjoxNzYwMjE3MDUwLCJlbWFpbCI6InRlc3RhZG1pbkBneW1iaXRlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0YWRtaW5AZ3ltYml0ZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.NM3-Hmi9GkL-omtRDZuCOdkA1eg6UznRpXxPYhM-qCFZkOQyhcHjX0SL36za5T7FAK4aLr7heXT7J762ZoHExPoGp6x0rXakCaJ5xN8Gfh07UUaKvZBKknjJxjcCMdebYQL8i1wy_OZvqD-OnopLxpJlL_w92VhLqY19guqgNbyJx417zF0zqLq_Ov89wsQV3c0vI00w6uIsBFSQAU4p7RYl_O9NrhrCeSk83crQ0KR2zo6OF6rpyndcibjKPBxvthS2wz0uuxaLFWbcfrunWaJ8UK11O13VUgq9xnYuXR-8pHrvtYOIixq6TQxQIjGs-EiLOyqZx6Yp6xe3TLWjCg';

// Sample data with new meal plan structure
const sampleData = {
  // User 1: Client
  client: {
    user: {
      firebaseUid: "client-john-doe-2025-v2",
      name: "John Doe",
      email: "john.doe.v2@example.com",
      role: "CLIENT"
    },
    profile: {
      weight: 75.5,
      height: 175.0,
      BMI: 24.2,
      fitnessGoals: "Lose 10kg and build muscle strength",
      dietaryPreferences: "Vegetarian, no dairy"
    }
  },
  
  // User 2: Trainer
  trainer: {
    user: {
      firebaseUid: "trainer-sarah-smith-2025-v2",
      name: "Sarah Smith",
      email: "sarah.smith.v2@gymbite.com",
      role: "TRAINER"
    },
    profile: {
      specialty: "Strength Training and Weight Loss",
      experienceYears: 5
    }
  },

  // Sample meal plans with new schema structure
  mealPlans: [
    {
      title: "High Protein Muscle Building Plan",
      description: "A comprehensive meal plan focused on muscle building with high protein content and balanced nutrition",
      category: "muscle_building",
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500",
      meals: [
        {
          name: "Protein Power Breakfast",
          description: "High protein breakfast to kickstart your day with energy",
          calories: 450,
          protein: 35,
          carbs: 30,
          fat: 18,
          ingredients: ["3 large eggs", "2 slices whole grain bread", "1/2 avocado", "1 cup Greek yogurt", "1 tbsp honey"],
          instructions: "Scramble eggs with minimal oil, toast bread, slice avocado, serve with honey-sweetened Greek yogurt",
          mealType: "breakfast",
          preparationTime: 15,
          imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"
        },
        {
          name: "Grilled Chicken Power Lunch",
          description: "Lean protein with complex carbs and vegetables for sustained energy",
          calories: 520,
          protein: 45,
          carbs: 35,
          fat: 15,
          ingredients: ["200g chicken breast", "1 cup brown rice", "150g mixed vegetables", "1 tbsp olive oil", "herbs and spices"],
          instructions: "Grill seasoned chicken breast, cook brown rice, steam mixed vegetables, drizzle with olive oil",
          mealType: "lunch",
          preparationTime: 25,
          imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500"
        },
        {
          name: "Post-Workout Recovery Shake",
          description: "Perfect post-workout meal to maximize muscle recovery and growth",
          calories: 300,
          protein: 40,
          carbs: 20,
          fat: 5,
          ingredients: ["1 scoop whey protein", "1 banana", "1 cup almond milk", "1 tbsp honey", "1 tsp vanilla extract"],
          instructions: "Blend all ingredients until smooth, add ice if desired for refreshing taste",
          mealType: "snack",
          preparationTime: 5,
          imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
        }
      ]
    },
    {
      title: "Vegetarian Weight Loss Plan",
      description: "Plant-based meals designed for healthy weight loss while maintaining energy levels",
      category: "weight_loss",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
      meals: [
        {
          name: "Green Smoothie Bowl",
          description: "Nutrient-dense breakfast packed with vitamins and fiber",
          calories: 320,
          protein: 15,
          carbs: 45,
          fat: 12,
          ingredients: ["1 cup spinach", "1/2 banana", "1/2 cup blueberries", "1 tbsp chia seeds", "1 cup coconut milk", "1 tbsp almond butter"],
          instructions: "Blend spinach, banana, and coconut milk. Pour into bowl, top with blueberries, chia seeds, and almond butter",
          mealType: "breakfast",
          preparationTime: 10,
          imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500"
        },
        {
          name: "Quinoa Buddha Bowl",
          description: "Colorful and filling lunch with complete proteins and healthy fats",
          calories: 380,
          protein: 18,
          carbs: 55,
          fat: 12,
          ingredients: ["1 cup cooked quinoa", "1 cup roasted chickpeas", "1/2 avocado", "1 cup mixed greens", "1/4 cup tahini dressing"],
          instructions: "Arrange quinoa and greens in bowl, top with roasted chickpeas and avocado, drizzle with tahini dressing",
          mealType: "lunch",
          preparationTime: 20,
          imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500"
        }
      ]
    },
    {
      title: "Keto Lifestyle Plan",
      description: "Low-carb, high-fat meals for ketogenic diet followers",
      category: "keto",
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500",
      meals: [
        {
          name: "Keto Avocado Breakfast",
          description: "High-fat, low-carb breakfast to maintain ketosis",
          calories: 420,
          protein: 20,
          carbs: 8,
          fat: 38,
          ingredients: ["1 large avocado", "2 eggs", "2 slices bacon", "1 tbsp coconut oil", "salt and pepper"],
          instructions: "Cook bacon until crispy, fry eggs in coconut oil, serve with sliced avocado",
          mealType: "breakfast",
          preparationTime: 12,
          imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500"
        }
      ]
    }
  ]
};

// API call function
async function apiCall(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ Error calling ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

// Main population function
async function populateData() {
  try {
    console.log('🚀 Starting data population...');

    // Create client user
    console.log('\n👤 Creating client user...');
    const clientUser = await apiCall('POST', '/users', sampleData.client.user);
    console.log(`✅ Client user created with ID: ${clientUser.id}`);

    // Create client profile
    console.log('📋 Creating client profile...');
    const clientProfile = await apiCall('POST', '/clients', {
      userId: clientUser.id,
      ...sampleData.client.profile
    });
    console.log(`✅ Client profile created with ID: ${clientProfile.id}`);

    // Create trainer user
    console.log('\n👩‍🏫 Creating trainer user...');
    const trainerUser = await apiCall('POST', '/users', sampleData.trainer.user);
    console.log(`✅ Trainer user created with ID: ${trainerUser.id}`);

    // Create trainer profile
    console.log('🏋️ Creating trainer profile...');
    const trainerProfile = await apiCall('POST', '/trainers', {
      userId: trainerUser.id,
      ...sampleData.trainer.profile
    });
    console.log(`✅ Trainer profile created with ID: ${trainerProfile.id}`);

    // Create meal plans with meals
    console.log('\n🥗 Creating meal plans with meals...');
    const createdMealPlans = [];

    for (const mealPlanData of sampleData.mealPlans) {
      console.log(`\n📝 Creating meal plan: ${mealPlanData.title}`);
      
      // Create the meal plan
      const mealPlan = await apiCall('POST', '/meal-plans', {
        userId: clientUser.id,
        title: mealPlanData.title,
        description: mealPlanData.description,
        category: mealPlanData.category,
        imageUrl: mealPlanData.imageUrl
      });
      console.log(`✅ Meal plan created with ID: ${mealPlan.id}`);

      // Create meals for this meal plan
      for (const mealData of mealPlanData.meals) {
        console.log(`  🍽️ Creating meal: ${mealData.name}`);
        
        const meal = await apiCall('POST', '/meals', {
          mealPlanId: mealPlan.id,
          name: mealData.name,
          description: mealData.description,
          calories: mealData.calories,
          protein: mealData.protein,
          carbs: mealData.carbs,
          fat: mealData.fat,
          ingredients: mealData.ingredients,
          instructions: mealData.instructions,
          mealType: mealData.mealType,
          preparationTime: mealData.preparationTime,
          imageUrl: mealData.imageUrl
        });
        console.log(`  ✅ Meal created with ID: ${meal.id}`);
      }

      createdMealPlans.push(mealPlan);
    }

    // Create sample workout plan
    console.log('\n💪 Creating sample workout plan...');
    const workoutPlan = await apiCall('POST', '/workout-plans', {
      userId: clientUser.id,
      name: "Beginner Strength Training",
      description: "4-week beginner strength training program focusing on compound movements",
      duration: 4,
      difficulty: "BEGINNER"
    });
    console.log(`✅ Workout plan created with ID: ${workoutPlan.id}`);

    // Create sample consultation
    console.log('\n📅 Creating sample consultation...');
    const consultation = await apiCall('POST', '/consultations', {
      clientId: clientProfile.id,
      trainerId: trainerProfile.id,
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      type: "INITIAL_ASSESSMENT",
      status: "SCHEDULED",
      notes: "Initial consultation to assess fitness goals and create personalized plan"
    });
    console.log(`✅ Consultation created with ID: ${consultation.id}`);

    // Create sample progress record
    console.log('\n📊 Creating sample progress record...');
    const progress = await apiCall('POST', '/progress', {
      clientId: clientProfile.id,
      date: new Date().toISOString(),
      weight: 75.0,
      bodyFatPercentage: 18.5,
      muscleMass: 55.2,
      workoutCompliance: "Completed 3/4 workouts this week",
      mealPlanCompliance: "Following meal plan 80% of the time"
    });
    console.log(`✅ Progress record created with ID: ${progress.id}`);

    // Summary
    console.log('\n🎉 Data population completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`👤 Client: ${clientUser.name} (ID: ${clientUser.id})`);
    console.log(`👩‍🏫 Trainer: ${trainerUser.name} (ID: ${trainerUser.id})`);
    console.log(`🥗 Meal Plans Created: ${createdMealPlans.length}`);
    createdMealPlans.forEach(mp => {
      console.log(`   - ${mp.title} (ID: ${mp.id})`);
    });
    console.log(`💪 Workout Plan: ${workoutPlan.name} (ID: ${workoutPlan.id})`);
    console.log(`📅 Consultation: ID ${consultation.id}`);
    console.log(`📊 Progress Record: ID ${progress.id}`);

  } catch (error) {
    console.error('💥 Population failed:', error.message);
    process.exit(1);
  }
}

// Run the population
populateData();