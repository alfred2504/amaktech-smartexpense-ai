import { Link } from "react-router-dom";
import { FiBarChart2, FiCpu, FiDollarSign, FiTarget } from "react-icons/fi";

const showcasePhotos = [
  {
    title: "Money Management",
    description: "See every cash move clearly, from salary to subscriptions.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Budget Planning",
    description: "Build spending plans you can actually stick to each month.",
    image:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "AI Financial Insights",
    description: "Let AI surface patterns and suggest smarter next steps.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
  },
];

const keyFeatures = [
  {
    title: "Transaction Intelligence",
    description: "Auto-categorize spending and spot unusual activity before it grows.",
    icon: FiDollarSign,
  },
  {
    title: "Live Analytics",
    description: "Track trends and cash flow with fast, readable charts.",
    icon: FiBarChart2,
  },
  {
    title: "Goal-Based Budgets",
    description: "Set category limits and follow progress in real time.",
    icon: FiTarget,
  },
  {
    title: "AI Assistant",
    description: "Get practical recommendations tailored to your history.",
    icon: FiCpu,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50 via-white to-cyan-50 text-slate-900">
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-28 -top-20 h-80 w-80 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />

        <header className="relative z-10 flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur sm:px-6">
          <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">SmartExpense AI</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="relative z-10 mt-12 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-900">
              Budgeting x Intelligence
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build Wealth Clarity With Money Data and AI Guidance
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Track transactions, shape realistic budgets, and get AI-backed insight from your spending behavior in one focused workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:-translate-y-0.5"
              >
                Start Free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80"
              alt="Hands organizing a monthly budget sheet"
              className="h-64 w-full rounded-2xl object-cover shadow-xl shadow-slate-900/10 sm:h-80"
              loading="lazy"
            />
            <div className="grid gap-4">
              <img
                src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80"
                alt="Calculator and currency on a finance desk"
                className="h-36 w-full rounded-2xl object-cover shadow-xl shadow-slate-900/10 sm:h-44"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=80"
                alt="Artificial intelligence concept on digital interface"
                className="h-36 w-full rounded-2xl object-cover shadow-xl shadow-slate-900/10 sm:h-32"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1"
              >
                <span className="inline-flex rounded-xl bg-slate-900 p-2.5 text-white transition group-hover:bg-cyan-600">
                  <Icon className="text-lg" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </section>

        <section className="relative z-10 mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Visual Motivation</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Money, Budget, and AI in Action</h3>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {showcasePhotos.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-2xl border border-white/50 bg-white shadow-xl shadow-slate-900/10"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <h4 className="absolute bottom-3 left-4 right-4 text-lg font-black text-white">{card.title}</h4>
                </div>
                <p className="p-4 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative z-10 mt-16 rounded-3xl bg-slate-900 px-6 py-10 text-center text-white shadow-2xl shadow-slate-900/20 sm:px-10">
          <h3 className="text-2xl font-black sm:text-3xl">Start managing money with sharper confidence</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Join SmartExpense AI and make every budget decision backed by real numbers and practical AI signals.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-8 py-3 text-sm font-extrabold text-slate-900 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            Create Your Free Account
          </Link>
        </section>

        <footer className="relative z-10 mt-10 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SmartExpense AI | Built by AmakTech
        </footer>
      </div>
    </div>
  );
}