// Improved sample data population script for Gymbite API
// This script will create multiple users (clients & trainers), profiles, workout & meal plans,
// appointments (in-person + virtual), consultations, progress records, feedback and notifications.
// It uses the public API endpoints to exercise create/update flows and relationships.

const API_BASE = process.env.BASE_URL || "http://localhost:3000/api";

// Put your actual Bearer token here or set FIREBASE_TEST_TOKEN env var
const authToken =
  process.env.FIREBASE_TEST_TOKEN ||
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMjEzMGZlZjAyNTg3ZmQ4ODYxODg2OTgyMjczNGVmNzZhMTExNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3ltYml0ZSIsImF1ZCI6Imd5bWJpdGUiLCJhdXRoX3RpbWUiOjE3NjA5NTU5MzYsInVzZXJfaWQiOiI0QXI3Zk9xZ3dpYmdHaVBNa21Zc056VE5ySXIxIiwic3ViIjoiNEFyN2ZPcWd3aWJnR2lQTWttWXNOelROcklyMSIsImlhdCI6MTc2MDk1ODU4NiwiZXhwIjoxNzYwOTYyMTg2LCJlbWFpbCI6InRlc3QxMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdDExQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.XzqlPHAoxw49qI16vZuY8f0CJCsnuuar1PetL5edhHJseJeS_M1FV_bgmP9i-XP0VO4JtnZGVDpriBn_abb53GnmANZpI-BTCH5cyS_4-Uz8D5h9JbyyJLeTle1piqVgPT33QYx9W5m6nwrxOepA0VIltpLSJ3R0Dl6lpcRRlMj0HaB7zjejXynnLft3ZiauCv_3hmTs9pSATOLOdnky8mQWjPplKzXk70JeT6zD4Sh7gJNNughf04CvxQj8LYa636u_zZykD85WcbDbSmuRDT9plASSI3QzdQw_fUkfhuncC3FYYfb3zBOMsSTgprwEx9iAeCdcArtILiK5Kv4eCQ";

if (!authToken) {
  console.warn(
    "⚠️ No Firebase test token provided. Set FIREBASE_TEST_TOKEN env var to run this script."
  );
}

// Minimal dependency-free HTTP helper.
// Uses global fetch when available (Node 18+). Otherwise falls back to built-in http/https.
import http from "http";
import https from "https";
import { URL } from "url";

async function fetchFallback(url, options = {}) {
  if (typeof fetch === "function") {
    return fetch(url, options);
  }

  // Fallback implementation using http/https
  const parsed = new URL(url);
  const lib = parsed.protocol === "https:" ? https : http;

  const requestOptions = {
    method: options.method || "GET",
    headers: options.headers || {},
    hostname: parsed.hostname,
    port: parsed.port,
    path: parsed.path,
  };

  return new Promise((resolve, reject) => {
    const req = lib.request(requestOptions, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          text: async () => raw,
        });
      });
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Simple API caller using fetchFallback
async function apiCall(method, endpoint, data = null) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const res = await fetchFallback(url, options);
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
    return json;
  } catch (err) {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    throw err;
  }
}

async function populateData() {
  console.log(
    "\n🚀 Starting comprehensive Gymbite data population with 5 users..."
  );

  try {
    // Health check
    try {
      await apiCall("GET", "/health");
      console.log("✅ Server health OK");
    } catch (e) {
      console.warn("⚠️ Health check failed (continuing):", e.message);
    }

    // ========== STEP 1: CREATE 5 USERS (3 clients + 2 trainers) ==========
    console.log("\n👥 Creating 5 users...");

    const usersData = [
      {
        firebaseUid: "client_emma_wilson_2025",
        name: "Emma Wilson",
        email: "emma.wilson@gmail.com",
        role: "CLIENT",
      },
      {
        firebaseUid: "client_marcus_chen_2025",
        name: "Marcus Chen",
        email: "marcus.chen@outlook.com",
        role: "CLIENT",
      },
      {
        firebaseUid: "client_sofia_rodriguez_2025",
        name: "Sofia Rodriguez",
        email: "sofia.rodriguez@yahoo.com",
        role: "CLIENT",
      },
      {
        firebaseUid: "trainer_james_thompson_2025",
        name: "James Thompson",
        email: "james.thompson@gymbite.com",
        role: "TRAINER",
      },
      {
        firebaseUid: "trainer_olivia_martin_2025",
        name: "Olivia Martin",
        email: "olivia.martin@gymbite.com",
        role: "TRAINER",
      },
    ];

    const users = [];
    for (const userData of usersData) {
      const user = await apiCall("POST", "/users", userData);
      users.push(user);
      console.log(`  ✓ ${user.name} (${user.role}) - userId=${user.id}`);
    }

    const [emma, marcus, sofia, james, olivia] = users;

    // ========== STEP 2: CREATE CLIENT PROFILES ==========
    console.log("\n🏃 Creating client profiles...");

    const emmaClient = await apiCall("POST", "/clients", {
      userId: emma.id,
      weight: 68.5,
      height: 165.0,
      BMI: 25.2,
      fitnessGoals: "Lose 8kg and tone muscles for summer",
      dietaryPreferences: "Pescatarian, gluten-free",
    });
    console.log(`  ✓ Emma's client profile - clientId=${emmaClient.id}`);

    const marcusClient = await apiCall("POST", "/clients", {
      userId: marcus.id,
      weight: 82.3,
      height: 178.0,
      BMI: 26.0,
      fitnessGoals: "Build strength and improve cardiovascular health",
      dietaryPreferences: "No restrictions, high protein",
    });
    console.log(`  ✓ Marcus's client profile - clientId=${marcusClient.id}`);

    const sofiaClient = await apiCall("POST", "/clients", {
      userId: sofia.id,
      weight: 59.0,
      height: 160.0,
      BMI: 23.0,
      fitnessGoals: "Maintain weight and increase flexibility",
      dietaryPreferences: "Vegan",
    });
    console.log(`  ✓ Sofia's client profile - clientId=${sofiaClient.id}`);

    // ========== STEP 3: CREATE TRAINER PROFILES ==========
    console.log("\n💪 Creating trainer profiles...");

    const jamesTrainer = await apiCall("POST", "/trainers", {
      userId: james.id,
      specialty: "Strength Training & Sports Performance",
      experienceYears: 8,
    });
    console.log(`  ✓ James's trainer profile - trainerId=${jamesTrainer.id}`);

    const oliviaTrainer = await apiCall("POST", "/trainers", {
      userId: olivia.id,
      specialty: "Yoga, Pilates & Nutrition Coaching",
      experienceYears: 6,
    });
    console.log(`  ✓ Olivia's trainer profile - trainerId=${oliviaTrainer.id}`);

    // ========== STEP 4: CREATE WORKOUT PLANS ==========
    console.log("\n🏋️ Creating workout plans...");

    const emmaWorkout = await apiCall("POST", "/workout-plans", {
      userId: emma.id,
      name: "Emma's Weight Loss Circuit",
      exercises:
        "Burpees:3x15;Mountain Climbers:3x20;Lunges:3x12;Jump Rope:3x60s",
      sets: 3,
      reps: 15,
    });
    console.log(`  ✓ Emma's workout plan - id=${emmaWorkout.id}`);

    const marcusWorkout = await apiCall("POST", "/workout-plans", {
      userId: marcus.id,
      name: "Marcus's Strength Builder",
      exercises: "Bench Press:4x8;Deadlifts:4x6;Pull-ups:4x10;Squats:4x8",
      sets: 4,
      reps: 8,
    });
    console.log(`  ✓ Marcus's workout plan - id=${marcusWorkout.id}`);

    const sofiaWorkout = await apiCall("POST", "/workout-plans", {
      userId: sofia.id,
      name: "Sofia's Flexibility Routine",
      exercises:
        "Yoga Flow:3x10min;Stretching:3x15min;Core Work:3x12;Balance Drills:3x10",
      sets: 3,
      reps: 12,
    });
    console.log(`  ✓ Sofia's workout plan - id=${sofiaWorkout.id}`);

    // ========== STEP 5: CREATE MEAL PLANS WITH MEALS ==========
    console.log("\n🥗 Creating meal plans with meals...");

    const emmaMealPlan = await apiCall("POST", "/meal-plans", {
      userId: emma.id,
      title: "Emma's Pescatarian Weight Loss Plan",
      description: "High protein, low carb meals for sustainable weight loss",
      category: "Weight Loss",
      calories: 1600,
      protein: 120.0,
      fat: 50.0,
      carbs: 140.0,
      meals: [
        {
          name: "Grilled Salmon with Quinoa",
          description:
            "Fresh Atlantic salmon with mixed quinoa and steamed vegetables",
          type: "Lunch",
          ingredients: [
            "Salmon fillet 150g",
            "Quinoa 80g",
            "Broccoli",
            "Lemon",
            "Olive oil",
          ],
          calories: 520,
          protein: 42,
        },
        {
          name: "Greek Yogurt Parfait",
          description: "Low-fat Greek yogurt with berries and almonds",
          type: "Breakfast",
          ingredients: [
            "Greek yogurt 200g",
            "Mixed berries 100g",
            "Almonds 20g",
            "Honey 10ml",
          ],
          calories: 280,
          protein: 18,
        },
        {
          name: "Tuna Salad Bowl",
          description: "Light tuna salad with mixed greens and avocado",
          type: "Dinner",
          ingredients: [
            "Tuna 120g",
            "Mixed greens",
            "Avocado half",
            "Cherry tomatoes",
            "Balsamic vinegar",
          ],
          calories: 380,
          protein: 35,
        },
      ],
    });
    console.log(`  ✓ Emma's meal plan with 3 meals - id=${emmaMealPlan.id}`);

    const marcusMealPlan = await apiCall("POST", "/meal-plans", {
      userId: marcus.id,
      title: "Marcus's High Protein Muscle Builder",
      description: "Protein-rich meals to support strength training",
      category: "Muscle Gain",
      calories: 2800,
      protein: 180.0,
      fat: 90.0,
      carbs: 280.0,
      meals: [
        {
          name: "Chicken Breast Power Bowl",
          description: "Grilled chicken with brown rice and sweet potato",
          type: "Lunch",
          ingredients: [
            "Chicken breast 200g",
            "Brown rice 150g",
            "Sweet potato 200g",
            "Spinach",
          ],
          calories: 680,
          protein: 55,
        },
        {
          name: "Protein Pancakes",
          description: "High protein pancakes with peanut butter",
          type: "Breakfast",
          ingredients: [
            "Protein powder 40g",
            "Eggs 3",
            "Banana",
            "Peanut butter 30g",
          ],
          calories: 520,
          protein: 42,
        },
      ],
    });
    console.log(
      `  ✓ Marcus's meal plan with 2 meals - id=${marcusMealPlan.id}`
    );

    const sofiaMealPlan = await apiCall("POST", "/meal-plans", {
      userId: sofia.id,
      title: "Sofia's Vegan Balance",
      description: "Plant-based nutrition for optimal health",
      category: "Vegan",
      calories: 1800,
      protein: 75.0,
      fat: 60.0,
      carbs: 220.0,
      meals: [
        {
          name: "Chickpea Buddha Bowl",
          description: "Roasted chickpeas with quinoa and tahini dressing",
          type: "Lunch",
          ingredients: [
            "Chickpeas 150g",
            "Quinoa 100g",
            "Kale",
            "Tahini 30ml",
            "Lemon",
          ],
          calories: 480,
          protein: 22,
        },
        {
          name: "Tofu Scramble",
          description: "Scrambled tofu with vegetables and avocado",
          type: "Breakfast",
          ingredients: [
            "Tofu 200g",
            "Bell peppers",
            "Onions",
            "Avocado half",
            "Turmeric",
          ],
          calories: 320,
          protein: 18,
        },
      ],
    });
    console.log(`  ✓ Sofia's meal plan with 2 meals - id=${sofiaMealPlan.id}`);

    // ========== STEP 6: CREATE APPOINTMENTS ==========
    console.log("\n📅 Creating appointments...");

    const now = Date.now();
    const appointments = [];

    // Emma with James
    const appt1 = await apiCall("POST", "/appointments", {
      clientId: emmaClient.id,
      trainerId: jamesTrainer.id,
      appointmentTime: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Initial fitness assessment and goal setting",
    });
    appointments.push(appt1);
    console.log(`  ✓ Emma ↔ James appointment - id=${appt1.id}`);

    // Marcus with James
    const appt2 = await apiCall("POST", "/appointments", {
      clientId: marcusClient.id,
      trainerId: jamesTrainer.id,
      appointmentTime: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Strength training technique review",
    });
    appointments.push(appt2);
    console.log(`  ✓ Marcus ↔ James appointment - id=${appt2.id}`);

    // Sofia with Olivia
    const appt3 = await apiCall("POST", "/appointments", {
      clientId: sofiaClient.id,
      trainerId: oliviaTrainer.id,
      appointmentTime: new Date(now + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Confirmed",
      notes: "Yoga session and flexibility assessment",
    });
    appointments.push(appt3);
    console.log(`  ✓ Sofia ↔ Olivia appointment - id=${appt3.id}`);

    // Past completed appointment (Emma with Olivia)
    const appt4 = await apiCall("POST", "/appointments", {
      clientId: emmaClient.id,
      trainerId: oliviaTrainer.id,
      appointmentTime: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      notes: "Nutrition consultation completed successfully",
    });
    appointments.push(appt4);
    console.log(`  ✓ Emma ↔ Olivia past appointment - id=${appt4.id}`);

    // ========== STEP 7: CREATE CONSULTATIONS ==========
    console.log("\n📞 Creating consultations...");

    const consult1 = await apiCall("POST", "/consultations", {
      clientId: marcusClient.id,
      trainerId: oliviaTrainer.id,
      scheduledAt: new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Virtual nutrition planning session",
    });
    console.log(`  ✓ Marcus ↔ Olivia consultation - id=${consult1.id}`);

    const consult2 = await apiCall("POST", "/consultations", {
      clientId: sofiaClient.id,
      trainerId: jamesTrainer.id,
      scheduledAt: new Date(now + 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Scheduled",
      notes: "Cross-training consultation",
    });
    console.log(`  ✓ Sofia ↔ James consultation - id=${consult2.id}`);

    // ========== STEP 8: CREATE PROGRESS RECORDS ==========
    console.log("\n📈 Creating progress records...");

    // Emma's progress over 4 weeks
    for (let week = 0; week < 4; week++) {
      const prog = await apiCall("POST", "/progress", {
        clientId: emmaClient.id,
        weight: (68.5 - week * 0.7).toFixed(1),
        BMI: (25.2 - week * 0.2).toFixed(1),
        progressDate: new Date(
          now - (3 - week) * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        workoutPerformance: week < 2 ? "Good" : "Excellent",
        mealPlanCompliance: `${75 + week * 5}%`,
      });
      console.log(
        `  ✓ Emma week ${week + 1} progress - weight: ${prog.weight}kg`
      );
    }

    // Marcus's progress over 3 weeks
    for (let week = 0; week < 3; week++) {
      const prog = await apiCall("POST", "/progress", {
        clientId: marcusClient.id,
        weight: (82.3 + week * 0.4).toFixed(1),
        BMI: (26.0 + week * 0.1).toFixed(1),
        progressDate: new Date(
          now - (2 - week) * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        workoutPerformance: "Excellent",
        mealPlanCompliance: `${85 + week * 3}%`,
      });
      console.log(
        `  ✓ Marcus week ${week + 1} progress - weight: ${prog.weight}kg`
      );
    }

    // Sofia's progress over 2 weeks
    for (let week = 0; week < 2; week++) {
      const prog = await apiCall("POST", "/progress", {
        clientId: sofiaClient.id,
        weight: 59.0,
        BMI: 23.0,
        progressDate: new Date(
          now - (1 - week) * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        workoutPerformance: "Good",
        mealPlanCompliance: "95%",
      });
      console.log(
        `  ✓ Sofia week ${week + 1} progress - weight: ${prog.weight}kg`
      );
    }

    // ========== STEP 9: CREATE FEEDBACK ==========
    console.log("\n⭐ Creating feedback...");

    const feedback1 = await apiCall("POST", "/feedbacks", {
      userId: emma.id,
      trainerId: jamesTrainer.id,
      rating: 5,
      comments:
        "James is incredibly knowledgeable and motivating. My strength has improved dramatically!",
    });
    console.log(`  ✓ Emma → James: 5 stars`);

    const feedback2 = await apiCall("POST", "/feedbacks", {
      userId: emma.id,
      trainerId: oliviaTrainer.id,
      rating: 5,
      comments:
        "Olivia's nutrition advice has been life-changing. Highly recommended!",
    });
    console.log(`  ✓ Emma → Olivia: 5 stars`);

    const feedback3 = await apiCall("POST", "/feedbacks", {
      userId: marcus.id,
      trainerId: jamesTrainer.id,
      rating: 5,
      comments:
        "Best trainer I've ever worked with. Results speak for themselves.",
    });
    console.log(`  ✓ Marcus → James: 5 stars`);

    const feedback4 = await apiCall("POST", "/feedbacks", {
      userId: sofia.id,
      trainerId: oliviaTrainer.id,
      rating: 4,
      comments: "Great yoga instructor, very patient and encouraging.",
    });
    console.log(`  ✓ Sofia → Olivia: 4 stars`);

    // ========== STEP 10: CREATE NOTIFICATIONS ==========
    console.log("\n🔔 Creating notifications...");

    const notifications = [
      {
        userId: emma.id,
        message: "Welcome to Gymbite! Your personalized plan is ready.",
        notificationType: "Welcome",
        status: "READ",
      },
      {
        userId: emma.id,
        message:
          "Reminder: Appointment with James Thompson tomorrow at 10:00 AM",
        notificationType: "Appointment",
        status: "UNREAD",
      },
      {
        userId: marcus.id,
        message: "New workout plan assigned: High Protein Muscle Builder",
        notificationType: "WorkoutPlan",
        status: "READ",
      },
      {
        userId: marcus.id,
        message: "Great progress this week! Keep it up!",
        notificationType: "Progress",
        status: "UNREAD",
      },
      {
        userId: sofia.id,
        message: "Your yoga session is confirmed for tomorrow",
        notificationType: "Appointment",
        status: "UNREAD",
      },
      {
        userId: james.id,
        message: "New client Emma Wilson has been assigned to you",
        notificationType: "ClientAssignment",
        status: "READ",
      },
      {
        userId: olivia.id,
        message: "Sofia Rodriguez left you a 4-star review",
        notificationType: "Feedback",
        status: "UNREAD",
      },
    ];

    for (const notifData of notifications) {
      const notif = await apiCall("POST", "/notifications", notifData);
      console.log(
        `  ✓ Notification for ${
          users.find((u) => u.id === notifData.userId).name
        }`
      );
    }

    // ========== SUMMARY ==========
    console.log("\n" + "=".repeat(60));
    console.log("🎉 COMPREHENSIVE DATA POPULATION COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`  • Users created: 5 (3 clients + 2 trainers)`);
    console.log(`  • Client profiles: 3`);
    console.log(`  • Trainer profiles: 2`);
    console.log(`  • Workout plans: 3`);
    console.log(`  • Meal plans: 3 (with 7 total meals)`);
    console.log(`  • Appointments: 4`);
    console.log(`  • Consultations: 2`);
    console.log(`  • Progress records: 9 (Emma: 4, Marcus: 3, Sofia: 2)`);
    console.log(`  • Feedback entries: 4`);
    console.log(`  • Notifications: 7`);
    console.log("\n👥 Users created:");
    console.log(`  1. Emma Wilson (CLIENT) - ${emma.email}`);
    console.log(`  2. Marcus Chen (CLIENT) - ${marcus.email}`);
    console.log(`  3. Sofia Rodriguez (CLIENT) - ${sofia.email}`);
    console.log(`  4. James Thompson (TRAINER) - ${james.email}`);
    console.log(`  5. Olivia Martin (TRAINER) - ${olivia.email}`);
    console.log("\n✅ All relationships established successfully!");
    console.log("=".repeat(60) + "\n");

    return true;
  } catch (error) {
    console.error("\n💥 Population failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the script when executed
populateData();
