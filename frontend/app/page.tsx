import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">
          🎯 OpportuNest — Your Opportunity Hub
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Discover internships, hackathons, scholarships, and opportunities
          tailored for you with AI-powered recommendations.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-center">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "🤖",
              title: "AI Recommendations",
              description:
                "Get personalized opportunity suggestions based on your skills and interests.",
            },
            {
              icon: "📄",
              title: "Resume Analyzer",
              description:
                "Get ATS scores, skill gaps, and actionable tips to improve your resume.",
            },
            {
              icon: "✅",
              title: "Eligibility Checker",
              description:
                "Automatically check if you meet the requirements before applying.",
            },
            {
              icon: "📢",
              title: "Smart Reminders",
              description:
                "Never miss a deadline with email, SMS, and push notifications.",
            },
            {
              icon: "🏆",
              title: "Gamification",
              description:
                "Earn badges and climb the leaderboard as you apply and succeed.",
            },
            {
              icon: "🕷️",
              title: "Auto-Scraper",
              description:
                "Opportunities from Internshala, Unstop, LinkedIn, and more in one place.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Active Users", value: "5,000+" },
            { label: "Opportunities", value: "10,000+" },
            { label: "Applications", value: "50,000+" },
            { label: "Success Rate", value: "85%+" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center rounded-lg border border-border bg-card p-6"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center rounded-lg border border-border bg-card p-12">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to find your next opportunity?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Join thousands of students who are discovering amazing opportunities
          with OpportuNest.
        </p>
        <Link
          href="/register"
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Start Exploring
        </Link>
      </section>

      {/* Status Indicators */}
      <section className="mt-16 text-center text-sm text-muted-foreground">
        <h3 className="mb-4 font-semibold">Service Status</h3>
        <div className="flex justify-center gap-8">
          <div>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Frontend: <a href="http://localhost:3000" className="text-primary hover:underline">localhost:3000</a>
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Backend: <a href="http://localhost:5000/health" className="text-primary hover:underline">localhost:5000</a>
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            AI Service: <a href="http://localhost:8000/health" className="text-primary hover:underline">localhost:8000</a>
          </div>
        </div>
      </section>
    </div>
  );
}
