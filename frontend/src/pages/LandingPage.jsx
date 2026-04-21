import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Target, MessageCircle, Briefcase, Award, TrendingUp, ArrowRight, Star, Moon, Sun, Sparkles, GraduationCap, Globe, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: Users, title: 'Smart Discovery', desc: 'AI-powered matching connects you with the right alumni mentors based on your skills and career goals.', color: 'from-blue-500 to-cyan-400' },
  { icon: Target, title: 'Mentorship System', desc: 'Structured mentorship with accept/reject flows, request tracking, and conversation history.', color: 'from-purple-500 to-violet-400' },
  { icon: MessageCircle, title: 'Real-Time Chat', desc: 'Instant messaging with typing indicators, read receipts, and online status.', color: 'from-emerald-500 to-green-400' },
  { icon: Briefcase, title: 'Career Opportunities', desc: 'Browse jobs, internships, and freelance gigs posted directly by alumni at top companies.', color: 'from-orange-500 to-amber-400' },
  { icon: Award, title: 'Profile Strength', desc: 'Build a professional profile with skills, courses, experience, and achievements.', color: 'from-pink-500 to-rose-400' },
  { icon: TrendingUp, title: 'Analytics & Insights', desc: 'Track connections, profile views, and mentorship stats with a detailed dashboard.', color: 'from-indigo-500 to-blue-400' },
];

const departments = [
  { name: 'Computer Science', icon: '💻', count: '2,400+', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
  { name: 'Mechanical Eng.', icon: '⚙️', count: '1,800+', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30' },
  { name: 'Electronics & Comm.', icon: '🔌', count: '1,600+', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30' },
  { name: 'Civil Engineering', icon: '🏗️', count: '1,200+', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30' },
  { name: 'Data Science & AI', icon: '🤖', count: '900+', color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30' },
  { name: 'Design & UX', icon: '🎨', count: '700+', color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'SWE at Google • B.Tech CSE', text: 'AlumniSphere helped me find an amazing mentor who guided me through my career transition into FAANG.', avatar: 'PS' },
  { name: 'Rajesh Khanna', role: 'Mechanical Engineer, Tesla', text: 'I connected with students from my alma mater and it feels great to give back to the next generation of engineers!', avatar: 'RK' },
  { name: 'Kavya Nair', role: 'ECE Student, NIT Trichy', text: 'Found a mentor at Intel through AlumniSphere. Got my dream internship in VLSI design!', avatar: 'KN' },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text">AlumniSphere</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-600 dark:text-dark-300">
            <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
            <a href="#departments" className="hover:text-primary-500 transition-colors">Departments</a>
            <a href="#testimonials" className="hover:text-primary-500 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-dark-600" />}
            </button>
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-primary-500 transition-colors">Sign In</Link>
            <Link to="/register" className="gradient-btn px-5 py-2.5 text-sm rounded-xl shadow-lg shadow-purple-500/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 border border-indigo-200/50 dark:border-indigo-700/30">
                <Sparkles size={14} className="text-amber-500" /> Trusted by 10,000+ alumni worldwide
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-black leading-[1.1]">
                <span className="text-dark-900 dark:text-white">Connect.</span>
                <br />
                <span className="text-dark-900 dark:text-white">Mentor.</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Grow Together.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-dark-400 leading-relaxed max-w-lg">
                The smart alumni networking platform that bridges the gap between students and industry professionals — across <strong className="text-dark-800 dark:text-dark-200">CSE, Mechanical, ECE, Civil</strong> and more.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
                <Link to="/register" className="group gradient-btn px-8 py-4 text-lg rounded-2xl flex items-center gap-2 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow">
                  Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="px-8 py-4 text-lg font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-500 transition-all rounded-2xl border-2 border-gray-200 dark:border-dark-700 hover:border-primary-400 hover:shadow-lg">
                  Sign In →
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['PS', 'RK', 'AK', 'NR'].map((initials, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full border-2 border-white dark:border-dark-800 flex items-center justify-center text-white text-xs font-bold bg-gradient-to-r ${
                      ['from-blue-500 to-cyan-500', 'from-orange-500 to-amber-500', 'from-purple-500 to-violet-500', 'from-emerald-500 to-green-500'][i]}`}>
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">Loved by students & alumni</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual cards */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative">
              <div className="relative">
                {/* Floating cards */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 w-64 p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-white/40 dark:border-dark-700 shadow-xl z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">PS</div>
                    <div>
                      <p className="font-bold text-sm text-dark-900 dark:text-white">Priya Sharma</p>
                      <p className="text-xs text-gray-500">SWE at Google</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">💻 B.Tech CSE • Bangalore</p>
                  <div className="mt-2 flex gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">React</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">Node.js</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">ML</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute top-32 left-0 w-60 p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-white/40 dark:border-dark-700 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold">RK</div>
                    <div>
                      <p className="font-bold text-sm text-dark-900 dark:text-white">Rajesh Khanna</p>
                      <p className="text-xs text-gray-500">Mech. Eng. at Tesla</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">⚙️ B.Tech Mechanical • USA</p>
                </motion.div>

                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
                  className="absolute top-60 right-8 w-56 p-4 rounded-2xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-white/40 dark:border-dark-700 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center text-white text-sm font-bold">SR</div>
                    <div>
                      <p className="font-bold text-sm text-dark-900 dark:text-white">Siddharth Rao</p>
                      <p className="text-xs text-gray-500">PM at L&T</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">🏗️ B.Tech Civil • Mumbai</p>
                </motion.div>

                {/* Decorative connection lines */}
                <svg className="absolute inset-0 w-full h-96 opacity-20 dark:opacity-10" viewBox="0 0 400 400">
                  <line x1="200" y1="40" x2="60" y2="180" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="40" x2="280" y2="300" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="60" y1="180" x2="280" y2="300" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="4 4" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="h-96" /> {/* Spacer for positioned cards */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gray-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ val: '10K+', label: 'Alumni Network', icon: Users }, { val: '5K+', label: 'Mentorships', icon: Target }, { val: '2K+', label: 'Opportunities', icon: Briefcase }, { val: '50+', label: 'Countries', icon: Globe }].map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-gradient-to-r ${
                ['from-blue-500/10 to-cyan-500/10', 'from-purple-500/10 to-violet-500/10', 'from-orange-500/10 to-amber-500/10', 'from-emerald-500/10 to-green-500/10'][i]}`}>
                <s.icon size={22} className={['text-blue-500', 'text-purple-500', 'text-orange-500', 'text-emerald-500'][i]} />
              </div>
              <p className="text-3xl md:text-4xl font-display font-black gradient-text">{s.val}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-4">
              <GraduationCap size={14} /> ALL DEPARTMENTS
            </div>
            <h2 className="text-4xl font-display font-bold text-dark-900 dark:text-white">Alumni Across Every Branch</h2>
            <p className="mt-3 text-gray-500 dark:text-dark-400 max-w-xl mx-auto">Connect with professionals from your specific engineering domain — from Indian IITs to global universities.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {departments.map((dept, i) => (
              <motion.div key={dept.name} {...fadeUp} transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-5 bg-gradient-to-br ${dept.color} border backdrop-blur-sm hover:scale-[1.03] transition-all duration-300 cursor-pointer`}>
                <span className="text-3xl">{dept.icon}</span>
                <h3 className="mt-3 font-bold text-dark-900 dark:text-white">{dept.name}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">{dept.count} alumni</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-transparent via-gray-100/50 dark:via-dark-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-4">
              <Zap size={14} /> POWERFUL FEATURES
            </div>
            <h2 className="text-4xl font-display font-bold text-dark-900 dark:text-white">Everything You Need to Succeed</h2>
            <p className="mt-3 text-gray-500 dark:text-dark-400 max-w-xl mx-auto">Powerful features to connect, grow, and succeed in your professional journey.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="group rounded-2xl p-6 bg-white/70 dark:bg-dark-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-dark-700/50 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-4">
              <Star size={14} /> TESTIMONIALS
            </div>
            <h2 className="text-4xl font-display font-bold text-dark-900 dark:text-white">Loved by Our Community</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="rounded-2xl p-6 bg-white/70 dark:bg-dark-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-dark-700/50 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 dark:text-dark-400 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-dark-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto rounded-3xl p-12 text-center text-white relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white/90 text-sm font-medium mb-6">
              <Sparkles size={14} /> Join 10,000+ members
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">Join students and alumni from IITs, NITs, SRM, MIT, Stanford and more who are already building professional connections.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all hover:scale-105 shadow-xl">
              Join AlumniSphere <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-dark-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold gradient-text">AlumniSphere</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-dark-400">
            © 2024 AlumniSphere. Built with ❤️ for the global alumni community.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>CSE</span><span>•</span><span>ECE</span><span>•</span><span>Mech</span><span>•</span><span>Civil</span><span>•</span><span>& more</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
