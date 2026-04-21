import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/20" style={{
              width: `${100 + i * 80}px`, height: `${100 + i * 80}px`,
              top: `${10 + i * 15}%`, left: `${5 + i * 12}%`,
              animation: `float ${4 + i}s ease-in-out infinite ${i * 0.5}s`
            }} />
          ))}
        </div>
        <div className="relative text-white text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold">A</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Welcome Back</h1>
            <p className="text-lg text-white/80 max-w-md">Connect with alumni, find mentors, and unlock career opportunities.</p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-dark-950">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h2 className="font-display font-bold text-2xl gradient-text">AlumniSphere</h2>
          </div>

          <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">Sign In</h2>
          <p className="text-gray-500 dark:text-dark-400 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email Address" type="email" icon={Mail} placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input label="Password" type="password" icon={Lock} placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-dark-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">Create Account</Link>
          </p>

          <div className="mt-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm">
            <p className="font-medium text-primary-700 dark:text-primary-300 mb-1">Demo Accounts:</p>
            <p className="text-primary-600 dark:text-primary-400">Alumni: priya@alumni.com</p>
            <p className="text-primary-600 dark:text-primary-400">Student: arjun@student.com</p>
            <p className="text-primary-600 dark:text-primary-400">Password: password123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
