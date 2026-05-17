import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const user = await login(formData.email, formData.password);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'service-center') {
        navigate('/service-center/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <div className="relative max-w-md w-full z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent tracking-wide"
          >
            VSRS
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-white">
            Sign in to your account
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Or{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Glass Card */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl backdrop-blur-md">
                {errors.general}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              className="w-full hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

          </form>
        </Card>

      </div>
    </div>
  );
};

export default Login;
