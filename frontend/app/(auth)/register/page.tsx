export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mb-8">
          Registration page coming soon. This will include a multi-step onboarding wizard
          for setting up your profile.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-border rounded-lg"
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-border rounded-lg"
              disabled
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-border rounded-lg"
              disabled
            />
            <button
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold"
              disabled
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
