/**
 * Enhanced API service with notification integration
 * Provides automatic success/error notifications for CRUD operations
 */

import { api } from "./api";
import type {
  UserFormData,
  WorkoutFormData,
  MealFormData,
  User,
  WorkoutPlan,
  MealPlan,
} from "../types/api";

interface NotificationOptions {
  showSuccess?: boolean;
  showError?: boolean;
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}

interface ApiWithNotificationsOptions {
  notifications?: NotificationOptions;
}

type NotificationFunction = (message: string, duration?: number) => void;

interface NotificationCallbacks {
  success: NotificationFunction;
  error: NotificationFunction;
  warning: NotificationFunction;
  info: NotificationFunction;
}

class ApiWithNotifications {
  private notifications: NotificationCallbacks | null = null;

  setNotifications(callbacks: NotificationCallbacks) {
    this.notifications = callbacks;
  }

  private showNotification(
    type: "success" | "error" | "warning" | "info",
    message: string,
    duration?: number
  ) {
    if (this.notifications) {
      this.notifications[type](message, duration);
    }
  }

  private getDefaultMessages() {
    return {
      user: {
        create: {
          success: "User created successfully",
          error: "Failed to create user",
        },
        update: {
          success: "User updated successfully",
          error: "Failed to update user",
        },
        delete: {
          success: "User deleted successfully",
          error: "Failed to delete user",
        },
      },
      workout: {
        create: {
          success: "Workout plan created successfully",
          error: "Failed to create workout plan",
        },
        update: {
          success: "Workout plan updated successfully",
          error: "Failed to update workout plan",
        },
        delete: {
          success: "Workout plan deleted successfully",
          error: "Failed to delete workout plan",
        },
      },
      meal: {
        create: {
          success: "Meal plan created successfully",
          error: "Failed to create meal plan",
        },
        update: {
          success: "Meal plan updated successfully",
          error: "Failed to update meal plan",
        },
        delete: {
          success: "Meal plan deleted successfully",
          error: "Failed to delete meal plan",
        },
      },
      trainer: {
        create: {
          success: "Trainer created successfully",
          error: "Failed to create trainer",
        },
        update: {
          success: "Trainer updated successfully",
          error: "Failed to update trainer",
        },
        delete: {
          success: "Trainer deleted successfully",
          error: "Failed to delete trainer",
        },
      },
      client: {
        create: {
          success: "Client created successfully",
          error: "Failed to create client",
        },
        update: {
          success: "Client updated successfully",
          error: "Failed to update client",
        },
        delete: {
          success: "Client deleted successfully",
          error: "Failed to delete client",
        },
      },
      appointment: {
        create: {
          success: "Appointment created successfully",
          error: "Failed to create appointment",
        },
        update: {
          success: "Appointment updated successfully",
          error: "Failed to update appointment",
        },
        delete: {
          success: "Appointment deleted successfully",
          error: "Failed to delete appointment",
        },
      },
      progress: {
        create: {
          success: "Progress record created successfully",
          error: "Failed to create progress record",
        },
        update: {
          success: "Progress record updated successfully",
          error: "Failed to update progress record",
        },
        delete: {
          success: "Progress record deleted successfully",
          error: "Failed to delete progress record",
        },
      },
      feedback: {
        delete: {
          success: "Feedback deleted successfully",
          error: "Failed to delete feedback",
        },
      },
    };
  }

  async withNotifications<T>(
    apiCall: () => Promise<T>,
    options: ApiWithNotificationsOptions = {}
  ): Promise<T> {
    const {
      showSuccess = true,
      showError = true,
      successMessage,
      errorMessage,
      duration = 5000,
    } = options.notifications || {};

    try {
      const result = await apiCall();

      if (showSuccess && successMessage) {
        this.showNotification("success", successMessage, duration);
      }

      return result;
    } catch (error) {
      if (showError) {
        const message =
          errorMessage ||
          (error instanceof Error
            ? error.message
            : "An unexpected error occurred");
        this.showNotification("error", message, duration);
      }
      throw error;
    }
  }

  // User API with notifications
  users = {
    create: async (
      data: UserFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<User> => {
      const defaultMessages = this.getDefaultMessages().user.create;
      return this.withNotifications(() => api.post("/users", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: UserFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<User> => {
      const defaultMessages = this.getDefaultMessages().user.update;
      return this.withNotifications(() => api.put(`/users/${id}`, data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().user.delete;
      return this.withNotifications(() => api.delete(`/users/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<User[]> => api.get("/users"),
    getById: (id: number): Promise<User> => api.get(`/users/${id}`),
  };

  // Workout API with notifications
  workouts = {
    create: async (
      data: WorkoutFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<WorkoutPlan> => {
      const defaultMessages = this.getDefaultMessages().workout.create;
      return this.withNotifications(() => api.post("/workout-plans", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: WorkoutFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<WorkoutPlan> => {
      const defaultMessages = this.getDefaultMessages().workout.update;
      return this.withNotifications(
        () => api.put(`/workout-plans/${id}`, data),
        {
          notifications: {
            showSuccess: true,
            showError: true,
            successMessage: defaultMessages.success,
            errorMessage: defaultMessages.error,
            ...options?.notifications,
          },
        }
      );
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().workout.delete;
      return this.withNotifications(() => api.delete(`/workout-plans/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<WorkoutPlan[]> => api.get("/workout-plans"),
    getById: (id: number): Promise<WorkoutPlan> =>
      api.get(`/workout-plans/${id}`),
  };

  // Meal API with notifications
  meals = {
    create: async (
      data: MealFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<MealPlan> => {
      const defaultMessages = this.getDefaultMessages().meal.create;
      return this.withNotifications(() => api.post("/meal-plans", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: MealFormData,
      options?: ApiWithNotificationsOptions
    ): Promise<MealPlan> => {
      const defaultMessages = this.getDefaultMessages().meal.update;
      return this.withNotifications(() => api.put(`/meal-plans/${id}`, data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().meal.delete;
      return this.withNotifications(() => api.delete(`/meal-plans/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<MealPlan[]> => api.get("/meal-plans"),
    getById: (id: number): Promise<MealPlan> => api.get(`/meal-plans/${id}`),
  };

  // Trainer API with notifications
  trainers = {
    create: async (
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().trainer.create;
      return this.withNotifications(() => api.post("/trainers", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().trainer.update;
      return this.withNotifications(() => api.put(`/trainers/${id}`, data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().trainer.delete;
      return this.withNotifications(() => api.delete(`/trainers/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<unknown[]> => api.get("/trainers"),
    getById: (id: number): Promise<unknown> => api.get(`/trainers/${id}`),
    getComplete: (id: number): Promise<unknown> =>
      api.get(`/trainers/${id}/complete`),
  };

  // Client API with notifications
  clients = {
    create: async (
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().client.create;
      return this.withNotifications(() => api.post("/clients", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().client.update;
      return this.withNotifications(() => api.put(`/clients/${id}`, data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().client.delete;
      return this.withNotifications(() => api.delete(`/clients/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<unknown[]> => api.get("/clients"),
    getById: (id: number): Promise<unknown> => api.get(`/clients/${id}`),
    getComplete: (id: number): Promise<unknown> =>
      api.get(`/clients/${id}/complete`),
  };

  // Appointment API with notifications
  appointments = {
    create: async (
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().appointment.create;
      return this.withNotifications(() => api.post("/appointments", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().appointment.update;
      return this.withNotifications(
        () => api.put(`/appointments/${id}`, data),
        {
          notifications: {
            showSuccess: true,
            showError: true,
            successMessage: defaultMessages.success,
            errorMessage: defaultMessages.error,
            ...options?.notifications,
          },
        }
      );
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().appointment.delete;
      return this.withNotifications(() => api.delete(`/appointments/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<unknown[]> => api.get("/appointments"),
    getById: (id: number): Promise<unknown> => api.get(`/appointments/${id}`),
  };

  // Progress API with notifications
  progress = {
    create: async (
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().progress.create;
      return this.withNotifications(() => api.post("/progress", data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    update: async (
      id: number,
      data: Record<string, unknown>,
      options?: ApiWithNotificationsOptions
    ): Promise<unknown> => {
      const defaultMessages = this.getDefaultMessages().progress.update;
      return this.withNotifications(() => api.put(`/progress/${id}`, data), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().progress.delete;
      return this.withNotifications(() => api.delete(`/progress/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<unknown[]> => api.get("/progress"),
    getById: (id: number): Promise<unknown> => api.get(`/progress/${id}`),
  };

  // Feedback API with notifications
  feedback = {
    delete: async (
      id: number,
      options?: ApiWithNotificationsOptions
    ): Promise<void> => {
      const defaultMessages = this.getDefaultMessages().feedback.delete;
      return this.withNotifications(() => api.delete(`/feedback/${id}`), {
        notifications: {
          showSuccess: true,
          showError: true,
          successMessage: defaultMessages.success,
          errorMessage: defaultMessages.error,
          ...options?.notifications,
        },
      });
    },

    getAll: (): Promise<unknown[]> => api.get("/feedback"),
    getById: (id: number): Promise<unknown> => api.get(`/feedback/${id}`),
  };
}

export const apiWithNotifications = new ApiWithNotifications();
export type { NotificationOptions, ApiWithNotificationsOptions };
