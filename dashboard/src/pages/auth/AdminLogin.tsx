import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../types/routes";

const AdminLogin = () => {
  // States for username, password, errors, and loading
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from the state, or default to dashboard
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  // Form validation
  const validateForm = () => {
    let valid = true;
    const errors: { username: string; password: string } = { username: "", password: "" };

    if (!username) {
      errors.username = "Username is required";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("🚀 Login button clicked!");
    console.log("📝 Form data:", { username, password: password ? "[PASSWORD PROVIDED]" : "[NO PASSWORD]" });

    if (validateForm()) {
      console.log("✅ Form validation passed");
      try {
        console.log("🔄 Attempting login with Firebase...");
        setIsSuccess(null); // Reset success state

        const success = await login({ username, password });

        console.log("🔍 Login result:", success);

        if (success) {
          console.log("✅ Login successful! Navigating to:", from);
          setIsSuccess(true);
          navigate(from, { replace: true });
        } else {
          console.log("❌ Login failed: Invalid credentials or not ADMIN user");
          setIsSuccess(false);
          setErrors({ username: "", password: "Invalid credentials or not an ADMIN user" });
        }
      } catch (error) {
        console.error("💥 Login error caught in component:", error);
        setIsSuccess(false);
        setErrors({ username: "", password: "Login failed. Please try again." });
      }
    } else {
      console.log("❌ Form validation failed");
      setIsSuccess(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg dark group/design-root overflow-x-hidden font-inter">
      {/* DEBUG: Visual indicator that component is rendering */}
      <div style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
        AdminLogin Rendered ✅
      </div>

      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-center whitespace-nowrap px-10 py-6">
          <div className="flex items-center gap-3 text-white">
            <svg
              className="h-8 w-8 text-primary-blue"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_543)">
                <path
                  d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                  fill="currentColor"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_543">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
            <h1 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              Gymbite Admin
            </h1>
          </div>
        </header>
        <main className="flex flex-1 justify-center py-5">
          <div className="flex w-full max-w-md flex-col items-center px-4">
            <div className="w-full rounded-lg bg-dark-card p-8 shadow-lg">
              <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-white">
                Admin Login
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Username */}
                <div>
                  <label className="sr-only" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      person
                    </span>
                    <input
                      className={`form-input block w-full rounded-md border-0 bg-dark-input py-3 pl-10 pr-3 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6 ${errors.username && "border-red-500"
                        }`}
                      id="username"
                      name="username"
                      placeholder="Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="sr-only" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      lock
                    </span>
                    <input
                      className={`form-input block w-full rounded-md border-0 bg-dark-input py-3 pl-10 pr-3 text-white shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6 ${errors.password && "border-red-500"
                        }`}
                      id="password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    className="flex w-full justify-center rounded-md bg-primary-blue px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                    onClick={() => {
                      console.log("🔴 BUTTON CLICKED DIRECTLY!");
                      // Don't preventDefault here, let the form submit naturally
                    }}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </button>
                </div>
              </form>

              {/* Forgot Password Link */}
              <div className="mt-6 text-center">
                <a
                  className="text-sm font-medium text-gray-400 hover:text-primary-blue transition-colors duration-200"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>

              {/* Success/Error Message */}
              {isSuccess === true && (
                <div className="mt-4 text-green-500 text-center text-sm">
                  Login successful!
                </div>
              )}
              {isSuccess === false && (
                <div className="mt-4 text-red-500 text-center text-sm">
                  Please fill in all fields correctly!
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;
