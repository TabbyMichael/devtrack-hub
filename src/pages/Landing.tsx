import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer, BarChart3, FolderKanban, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-dashboard.jpg';

const features = [
  {
    icon: Timer,
    title: 'Time Tracking',
    description: 'Start and stop sessions with one click. Track every minute of your development work across projects.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Visualize your productivity with charts, streaks, and trends. Know exactly where your time goes.',
  },
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Organize your work into projects. See total hours, session counts, and progress at a glance.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Timer className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">DevTrack</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="bg-gradient-radial absolute inset-0" />
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 lg:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Built for developers who ship
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mb-6 font-heading text-5xl font-bold leading-tight tracking-tight lg:text-7xl"
            >
              Track Your <span className="text-gradient">Dev Time</span>,{' '}
              <br className="hidden sm:block" />
              Ship Faster
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mb-10 text-lg text-muted-foreground lg:text-xl"
            >
              The productivity dashboard built for developers. Track coding sessions,
              manage projects, and gain insights to level up your workflow.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  Start Tracking Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="glow-primary-lg overflow-hidden rounded-xl border border-border">
              <img
                src={heroImage}
                alt="DevTrack dashboard preview"
                className="w-full"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <motion.h2 custom={0} variants={fadeUp} className="mb-4 font-heading text-3xl font-bold lg:text-4xl">
              Everything you need to <span className="text-gradient">stay productive</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-muted-foreground">
              Simple, powerful tools designed for developers.
            </motion.p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold">Ready to track your productivity?</h2>
          <p className="mb-8 text-muted-foreground">Join developers who are shipping faster with DevTrack.</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/register">
              Get Started — It&apos;s Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          © 2026 DevTrack. Built with focus.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
