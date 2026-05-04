import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Radio, Truck, PartyPopper, HardHat, Building2, Signal, Wallet, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero3D } from "@/components/Hero3D";
import "./Landing.css";

const useCases = [
  { icon: PartyPopper, title: "Events & Production", text: "Coordinate weddings, concerts, and film sets with seamless, interference-free audio." },
  { icon: ShieldCheck, title: "Security Teams", text: "Encrypted channels for rapid response and tactical coordination in high-stakes environments." },
  { icon: HardHat, title: "Construction Sites", text: "IP67-rated rugged devices built to withstand dust, water, and hard drops on site." },
  { icon: Building2, title: "Corporate Functions", text: "Discreet communication for high-level summits and boardroom logistics." },
];

const benefits = [
  { icon: Signal, title: "Long Range", text: "Crystal-clear audio over miles with advanced signal penetration." },
  { icon: Wallet, title: "Affordable Rentals", text: "Flexible pricing for single-day events or long-term projects." },
  { icon: Zap, title: "Easy Setup", text: "Plug-and-play devices pre-configured to your channel needs." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="label-caps inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass">
              <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse" />
              Premium Rental Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[1.05] tracking-tight">
              Stay Connected,<br />
              <span className="text-gradient">Anywhere.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Professional walkie-talkie rentals across India. High-performance communication
              equipment for events, security operations, and industrial sites — delivered when you need it.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-glow">
                <Link to="/rent">Rent Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/rent">View Inventory</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-tertiary" /> 5,000+ devices</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-tertiary" /> Pan-India delivery</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-tertiary" /> 24/7 support</span>
            </div>
          </motion.div>

          <Hero3D />
        </div>
      </section>

      {/* ABOUT */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="label-caps text-tertiary mb-3">Our Story</p>
          <h2 className="text-4xl md:text-5xl font-bold">Reliable Communication, Simplified</h2>
          <p className="mt-4 text-muted-foreground">
            WalkieTalkieRentalsIndia brings world-class communication technology to every corner of India.
            With a fleet of over 5,000 devices, we ensure your team stays in sync — whatever the mission.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 glass rounded-full px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-tertiary" />
            Government-licensed frequencies
          </div>
        </motion.div>
      </section>

      {/* USE CASES */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="label-caps text-primary mb-2">Applications</p>
            <h2 className="text-3xl md:text-4xl font-bold">Engineered for Every Scenario</h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Specialized equipment calibrated for specific industry demands.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {useCases.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass glass-hover rounded-2xl p-6"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                <u.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{u.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{u.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass glass-hover rounded-2xl p-6 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-tertiary/15 flex items-center justify-center mx-auto mb-4">
                <b.icon className="h-7 w-7 text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to scale your team's communication?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join thousands of businesses across India that rely on us for mission-critical communications.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-glow">
                <Link to="/rent">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">Talk to Expert</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
