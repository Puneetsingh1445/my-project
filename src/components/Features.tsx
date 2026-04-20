import { motion } from "motion/react";
import { BarChart3, Edit3, Brain, Network } from "lucide-react";

const capabilities = [
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "Mood tracking",
    description: "Identifying subtle shifts in your emotional landscape."
  },
  {
    icon: <Edit3 className="w-8 h-8 text-primary" />,
    title: "AI-guided journaling",
    description: "Deep prompts tailored to your current headspace."
  },
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "Stress analysis",
    description: "Real-time biometrics integration for calm detection."
  },
  {
    icon: <Network className="w-8 h-8 text-primary" />,
    title: "Cognitive patterns",
    description: "Recognizing reoccurring thoughts and habits."
  }
];

export default function Features() {
  return (
    <section id="features" className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-11 bg-surface-container-low rounded-[2rem] p-8 lg:p-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Capabilities */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <h2 className="font-headline font-extrabold text-4xl lg:text-5xl text-on-surface tracking-tight">
                Ethereal Intelligence
              </h2>
              <p className="text-on-surface-variant text-lg">
                Sophisticated analysis for a clearer version of you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col md:flex-row gap-12"
            >
              <div className="flex flex-col space-y-6">
                <button className="text-left group">
                  <span className="block text-xs font-bold tracking-widest text-primary uppercase mb-1">Capabilities</span>
                  <span className="block h-0.5 w-8 bg-primary transition-all group-hover:w-full"></span>
                </button>
                <button className="text-left group opacity-40 hover:opacity-100 transition-opacity">
                  <span className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Features</span>
                </button>
                <button className="text-left group opacity-40 hover:opacity-100 transition-opacity">
                  <span className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Compatibility</span>
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="space-y-2"
                  >
                    {cap.icon}
                    <h4 className="font-headline font-bold text-lg text-on-surface">{cap.title}</h4>
                    <p className="text-sm text-on-surface-variant font-light leading-relaxed">{cap.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Static brain visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center items-center min-h-[400px]"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 m-auto w-[65%] h-[65%] bg-primary/10 rounded-full blur-[80px]" />
            <img
              src="/brain-hero.png"
              alt="3D brain with blooming flowers"
              className="relative w-full max-w-[420px] h-auto object-contain drop-shadow-2xl floating-object"
              style={{ maxHeight: "min(500px, 60vh)", transform: "rotate(-6deg)" }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1559757147-947ae61a5202?auto=format&fit=crop&w=520&q=80";
                e.currentTarget.onerror = null;
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Side: Vertical Dot Nav */}
      <div className="lg:col-span-1 hidden lg:flex flex-col justify-center items-center gap-6">
        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
      </div>
    </section>
  );
}

