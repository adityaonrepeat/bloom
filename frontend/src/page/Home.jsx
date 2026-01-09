import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      
      {/* Navbar */}
      <Navbar/>
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 mt-24">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Where Conversations <span className="text-emerald-600">Bloom</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
            Bloom is a safe space for moments when life feels heavy.
            Talk openly with supportive people or a caring AI — anonymously,
            without judgment, and at your own pace.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-32 px-6 md:px-12">
        <h3 className="text-3xl font-bold text-center text-gray-900">
          Why Bloom?
        </h3>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-emerald-600">
              Instant Matching
            </h4>
            <p className="mt-2 text-gray-600">
              Connect with people instantly based on shared interests.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-emerald-600">
              Real-Time Chat
            </h4>
            <p className="mt-2 text-gray-600">
              Smooth, fast, and seamless conversations anytime.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-emerald-600">
              Safe & Secure
            </h4>
            <p className="mt-2 text-gray-600">
              Privacy-first design with secure communication.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bloom. All rights reserved.
      </footer>
    </div>
  );
}
