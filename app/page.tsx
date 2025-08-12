import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <header className="navbar bg-base-100">
        <div className="navbar-start">
          <h1 className="text-5xl text-success m-6"><Link href="/">QUIZZLER</Link></h1>
        </div>
        
        <div className="navbar-end">
          <nav>
            <ul className="menu menu-horizontal">
              <Link className="btn btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl m-2" href="/login">Login</Link>
              <Link className="btn btn-outline btn-success btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl m-2" href="register">Register</Link>
            </ul>
          </nav>
        </div>
      </header>
      <main className="w-full bg-success text-success-content py-20">
  <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-6">
    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
      Create, Share, and Conquer Quizzes in Seconds!
    </h1>
    <p className="text-lg opacity-90 mb-8 max-w-2xl">
      Build fun and engaging quizzes effortlessly. Share them with friends or challenge the world!
    </p>
    <Link href="/register" className="btn btn-outline btn-success-content btn-lg px-8">
      Get Started
    </Link>
  </div>
</main>
<section className="w-full bg-base-200 text-base-content py-20">
  <div className="max-w-6xl mx-auto flex flex-col items-center text-center px-6">
    <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
    <p className="text-lg opacity-90 mb-12 max-w-2xl">
      Getting started is quick and easy — just follow these simple steps.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <div className="text-success text-4xl mb-3">1️⃣</div>
        <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
        <p className="opacity-80">Create your free account and get instant access to the quiz builder.</p>
      </div>
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <div className="text-success text-4xl mb-3">2️⃣</div>
        <h3 className="text-xl font-semibold mb-2">Create Your Quiz</h3>
        <p className="opacity-80">Add questions, set answers, and design your perfect quiz.</p>
      </div>
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <div className="text-success text-4xl mb-3">3️⃣</div>
        <h3 className="text-xl font-semibold mb-2">Share & Play</h3>
        <p className="opacity-80">Send your quiz link to friends or post it online for everyone to try.</p>
      </div>
      <div className="bg-base-100 p-6 rounded-lg shadow-md">
        <div className="text-success text-4xl mb-3">4️⃣</div>
        <h3 className="text-xl font-semibold mb-2">See the Results</h3>
        <p className="opacity-80">Track scores and review participant performance instantly.</p>
      </div>
    </div>
  </div>
</section>


      <Footer/>
    </div>
  );
}
