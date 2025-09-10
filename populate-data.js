// Sample data population script for Gymbite API
// Run this script to populate the database with sample client and trainer data

const API_BASE = 'http://localhost:3000/api';

// Sample data
const sampleData = {
  // User 1: Client
  client: {
    user: {
      firebaseUid: "client-john-doe-2025",
      name: "John Doe",
      email: "john.doe@example.com",
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
      firebaseUid: "trainer-sarah-smith-2025",
      name: "Sarah Smith",
      email: "sarah.smith@gymbite.com",
      role: "TRAINER"
    },
    profile: {
      specialty: "Strength Training and Weight Loss",
      experienceYears: 5
    }
  }
};

// API call function
async function apiCall(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error calling ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

// Main population function
async function populateData() {
  console.log('🚀 Starting Gymbite data population...\n');
  
  try {
    // Test server connection
    console.log('📡 Testing server connection...');
    await apiCall('GET', '/health');
    console.log('✅ Server is running and healthy\n');
    
    // Create Users
    console.log('👥 Creating users...');
    
    // Create Client User
    console.log('👤 Creating client user: John Doe');
    const clientUser = await apiCall('POST', '/users', sampleData.client.user);
    console.log(`✅ Client user created with ID: ${clientUser.id}`);
    
    // Create Trainer User
    console.log('👤 Creating trainer user: Sarah Smith');
    const trainerUser = await apiCall('POST', '/users', sampleData.trainer.user);
    console.log(`✅ Trainer user created with ID: ${trainerUser.id}\n`);
    
    // Create Client Profile
    console.log('🏃‍♂️ Creating client profile...');
    const clientProfile = await apiCall('POST', '/clients', {
      userId: clientUser.id,
      ...sampleData.client.profile
    });
    console.log(`✅ Client profile created with ID: ${clientProfile.id}`);
    
    // Create Trainer Profile
    console.log('💪 Creating trainer profile...');
    const trainerProfile = await apiCall('POST', '/trainers', {
      userId: trainerUser.id,
      ...sampleData.trainer.profile
    });
    console.log(`✅ Trainer profile created with ID: ${trainerProfile.id}\n`);
    
    // Create sample workout plan for the client
    console.log('🏋️‍♂️ Creating sample workout plan...');
    const workoutPlan = await apiCall('POST', '/workout-plans', {
      userId: clientUser.id,
      name: "Beginner Strength Training",
      exercises: "Push-ups: 3 sets, Squats: 3 sets, Planks: 3 sets, Lunges: 3 sets",
      sets: 3,
      reps: 12
    });
    console.log(`✅ Workout plan created with ID: ${workoutPlan.id}`);
    
    // Create sample meal plan for the client
    console.log('🥗 Creating sample meal plan...');
    const mealPlan = await apiCall('POST', '/meal-plans', {
      userId: clientUser.id,
      name: "Vegetarian Weight Loss Plan",
      description: "High protein vegetarian meals for weight loss and muscle building",
      calories: 1800,
      protein: 120.0,
      fat: 60.0,
      carbs: 180.0
    });
    console.log(`✅ Meal plan created with ID: ${mealPlan.id}`);
    
    // Create sample consultation
    console.log('📅 Creating sample consultation...');
    const consultation = await apiCall('POST', '/consultations', {
      clientId: clientProfile.id,
      trainerId: trainerProfile.id,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: "Scheduled",
      notes: "Initial consultation to discuss fitness goals and create personalized plan"
    });
    console.log(`✅ Consultation created with ID: ${consultation.id}`);
    
    // Create sample appointment
    console.log('📅 Creating sample appointment...');
    const appointment = await apiCall('POST', '/appointments', {
      clientId: clientProfile.id,
      trainerId: trainerProfile.id,
      appointmentTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      status: "Scheduled",
      notes: "First training session - focus on form and baseline assessment"
    });
    console.log(`✅ Appointment created with ID: ${appointment.id}`);
    
    // Create sample progress record
    console.log('📊 Creating sample progress record...');
    const progress = await apiCall('POST', '/progress', {
      clientId: clientProfile.id,
      weight: 75.5,
      BMI: 24.2,
      progressDate: new Date().toISOString(),
      workoutPerformance: "Completed beginner workout with good form",
      mealPlanCompliance: "Following meal plan 80% of the time"
    });
    console.log(`✅ Progress record created with ID: ${progress.id}`);
    
    // Create sample feedback
    console.log('⭐ Creating sample feedback...');
    const feedback = await apiCall('POST', '/feedbacks', {
      userId: clientUser.id,
      trainerId: trainerProfile.id,
      rating: 5,
      comments: "Sarah is an excellent trainer! Very knowledgeable and supportive."
    });
    console.log(`✅ Feedback created with ID: ${feedback.id}`);
    
    // Create sample notification
    console.log('🔔 Creating sample notification...');
    const notification = await apiCall('POST', '/notifications', {
      userId: clientUser.id,
      message: "Welcome to Gymbite! Your trainer Sarah has created a personalized workout plan for you.",
      notificationType: "Welcome",
      status: "Unread"
    });
    console.log(`✅ Notification created with ID: ${notification.id}\n`);
    
    // Summary
    console.log('🎉 Data population completed successfully!\n');
    console.log('📋 Summary of created data:');
    console.log(`👤 Client User: ${clientUser.name} (ID: ${clientUser.id})`);
    console.log(`👤 Trainer User: ${trainerUser.name} (ID: ${trainerUser.id})`);
    console.log(`🏃‍♂️ Client Profile: ID ${clientProfile.id}`);
    console.log(`💪 Trainer Profile: ID ${trainerProfile.id}`);
    console.log(`🏋️‍♂️ Workout Plan: ${workoutPlan.name} (ID: ${workoutPlan.id})`);
    console.log(`🥗 Meal Plan: ${mealPlan.name} (ID: ${mealPlan.id})`);
    console.log(`📅 Consultation: ID ${consultation.id}`);
    console.log(`📅 Appointment: ID ${appointment.id}`);
    console.log(`📊 Progress Record: ID ${progress.id}`);
    console.log(`⭐ Feedback: ID ${feedback.id}`);
    console.log(`🔔 Notification: ID ${notification.id}\n`);
    
    console.log('🌐 You can now test these endpoints:');
    console.log(`GET ${API_BASE}/users/${clientUser.id} - View client user`);
    console.log(`GET ${API_BASE}/users/${trainerUser.id} - View trainer user`);
    console.log(`GET ${API_BASE}/clients/${clientProfile.id}/complete - View complete client profile`);
    console.log(`GET ${API_BASE}/trainers/${trainerProfile.id}/complete - View complete trainer profile`);
    console.log(`GET ${API_BASE}/clients/${clientProfile.id}/progress - View client progress`);
    console.log(`GET ${API_BASE}/trainers/${trainerProfile.id}/metrics - View trainer metrics`);
    
  } catch (error) {
    console.error('💥 Population failed:', error.message);
    process.exit(1);
  }
}

// Run the population
populateData();
