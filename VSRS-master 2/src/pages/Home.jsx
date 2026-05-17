import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const features = [
  {
    icon: '✅',
    title: 'Easy Registration',
    desc: 'Quick and simple vehicle registration process',
    color: 'bg-[#2563eb]/20',
    dot: 'bg-[#2563eb]'
  },
  {
    icon: '⏱',
    title: 'Real-time Tracking',
    desc: 'Track your service status in real-time',
    color: 'bg-[#22c55e]/20',
    dot: 'bg-[#22c55e]'
  },
  {
    icon: '⚡',
    title: 'Fast & Efficient',
    desc: 'Streamlined process for quick service',
    color: 'bg-[#8b5cf6]/20',
    dot: 'bg-[#8b5cf6]'
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">VSRS</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10 animate-glow pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-[120px] opacity-10 animate-glow pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Vehicle Service Registration System
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Manage Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#22c55e] bg-clip-text text-transparent">
              Vehicle Services
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Replace manual paperwork with a modern digital platform. Register vehicles, book services, and track everything in real-time.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="lg" className="shadow-2xl shadow-blue-500/30">
                🚀 Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Demo hint */}
          <p className="mt-6 text-sm text-gray-600">
            Try demo: <span className="text-gray-400">admin@demo.com</span> · <span className="text-gray-400">service@demo.com</span>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} hover className="text-center group">
              <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>

        {/* Roles section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { role: 'Customer', icon: '👤', desc: 'Register vehicles, book services, track history', color: 'border-blue-500/30 bg-blue-500/5' },
            { role: 'Service Center', icon: '🔧', desc: 'Manage incoming requests, update service status', color: 'border-green-500/30 bg-green-500/5' },
            { role: 'Admin', icon: '🛡', desc: 'Full system overview, user & booking management', color: 'border-purple-500/30 bg-purple-500/5' },
          ].map((r, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${r.color} text-center`}>
              <div className="text-3xl mb-3">{r.icon}</div>
              <h4 className="font-semibold text-white mb-2">{r.role}</h4>
              <p className="text-gray-400 text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
