
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 font-headline">
            <span className="text-primary">Serene</span>Mind
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimonials</a>
          </nav>
          <Button asChild>
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight font-headline">
              Find Your Calm Productivity: <br className="hidden md:block" /> Achieve More, Stress Less. 🌟
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a task manager designed for <em>your</em> pace, fostering emotional well-being without judgment or rigid demands.
            </p>
            <Button asChild size="lg" className="mt-8 text-lg font-semibold hover:scale-105 transition-transform transform">
              <Link href="/dashboard">
                Get Started for Free
              </Link>
            </Button>
            <div className="mt-12 md:mt-16 h-64 w-full max-w-4xl mx-auto bg-primary/5 rounded-lg shadow-lg flex items-center justify-center p-4">
               <img src="https://placehold.co/800x400.png" alt="App screenshot" className="rounded-lg object-cover w-full h-full" data-ai-hint="calm abstract" />
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-headline">The "Why Us"</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-headline">The Problem</h3>
                <p className="text-gray-600 leading-relaxed">
                  Are you tired of productivity apps that feel like another source of stress? 😩 Do rigid checklists lead to task paralysis, overwhelming you with guilt when you miss a streak? Many tools push a 'hustle culture' that ignores the very real challenges of managing emotions, neurodivergence, or simply having an off day. It's hard to process feelings when you're constantly fighting against self-criticism and the pressure to 'do more, faster.'
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-headline">Our Solution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Introducing <strong>SereneMind</strong>: Your refreshing alternative. We believe well-being comes first. Our app provides a <strong>gentle, non-punitive, and supportive framework</strong> that adapts to <em>your</em> life, not the other way around. We help you address your tasks and emotions with understanding, empowering you to build resilience and genuine growth, all built on your choices and without a hint of judgment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-headline">Key Features</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need for a gentler approach to productivity and well-being.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-background p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Achieve Your Goals, Your Way.</h3>
                <p className="text-muted-foreground">
                  Easily create tasks and break them down into manageable sub-tasks. Prioritize by importance and urgency, but here's the difference: there are no punitive streaks, 'failed' statuses, or guilt-inducing metrics.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-background p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Understand Your Inner World.</h3>
                <p className="text-muted-foreground">
                  Take a simple mood check-in using intuitive emojis to quickly log how you're feeling. Our free-form journaling space is a safe, non-clinical environment for unburdened self-reflection.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-background p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Celebrate Every Step Forward.</h3>
                <p className="text-muted-foreground">
                  Experience our gentle gamified system: earn points for engaging with tasks and journaling. Unlock basic digital rewards and badges, acknowledging your progress. Crucially, we have ABSOLUTELY NO PUNITIVE STREAKS OR METRICS.
                </p>
              </div>
              {/* Feature 4 */}
              <div className="bg-background p-8 rounded-lg text-center transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Shift Your Self-Talk.</h3>
                <p className="text-muted-foreground">
                  Empower your mind daily with our curated library of positive affirmations. Designed to counter negative self-talk, promote self-belief, and offer gentle inspiration for your day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 font-headline">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-4">1</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Check In & Plan Your Day</h3>
                <p className="text-gray-600">Begin by logging your mood and setting your tasks at your own pace.</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-4">2</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Reflect & Journal</h3>
                <p className="text-gray-600">Use our private space to reflect on your day and understand your emotions.</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-primary mb-4">3</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 font-headline">Feel Supported & Grow</h3>
                <p className="text-gray-600">Celebrate your efforts with gentle rewards and daily affirmations, building resilience without pressure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-headline">What Our Users Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic mb-4">"Finally, a productivity app that doesn't make me feel guilty when my brain doesn't cooperate! It truly helps me manage my tasks and my mood without any judgment."</p>
                <p className="font-semibold text-foreground">- A relieved user</p>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic mb-4">"The most supportive app I've ever used for my mental well-being. It's gentle, effective, and actually helps me understand myself better."</p>
                <p className="font-semibold text-foreground">- Someone finding peace</p>
              </div>
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic mb-4">"This app understands that progress isn't always linear. It feels like a genuine partner in my wellness journey, not just another demanding tool."</p>
                <p className="font-semibold text-foreground">- A user regaining control</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Ready to Experience Gentle Wellness?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">Start your journey towards a more balanced and fulfilling life.</p>
            <Button asChild size="lg" variant="secondary" className="text-lg font-semibold hover:scale-105 transition-transform transform">
              <Link href="/dashboard">
                Start Now! 🚀
              </Link>
            </Button>
          </div>
        </section>

        {/* Credibility & Privacy Section */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 font-headline">Our Commitment to You</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At SereneMind, we are deeply committed to your well-being through thoughtful, accessible design. We believe that privacy is a fundamental right. We are transparent about our data collection and usage, ensuring your personal reflections and progress remain private and secure. Your journey is yours alone.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 SereneMind. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">App Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
