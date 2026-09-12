import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              formAction={login}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}