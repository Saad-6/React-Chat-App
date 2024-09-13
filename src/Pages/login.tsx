import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Github, Twitter } from 'lucide-react'
import { Input } from '../Components/UI/input'
import { Button } from '../Components/UI/button'
import { Link, useNavigate } from 'react-router-dom'
import { LoginModel } from '../Interfaces/LoginModel'
import { APIResponse } from '../Interfaces/APIResponse'
import { SuccessToast } from '../Components/UI/SuccessToast'
import { FailureToast } from '../Components/UI/FailiureToast'
import { Loader } from '../Components/UI/Loader'
import { LoginResponseModel } from '../Interfaces/LoginResponseModel'


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [buttonText, setButtonText] = useState("Sign in");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [formData, setFormData] = useState<LoginModel>({
    Email: '',
    Password: '',
});
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Setting loading to true');
    setIsLoading(true);
    
    try {
      const res = await fetch('https://localhost:7032/Login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result: APIResponse = await res.json();
      setIsLoading(false);
      console.log(result);
      if (result.success) {
        const loginResponse: LoginResponseModel = result.result;
        console.log(loginResponse);
        setToastMessage(result.message);
        setShowSuccessToast(true);
        setButtonText("You are now being redirected to the home page");
        
        setTimeout(() => {
          setShowSuccessToast(false);
          navigate("/");
        }, 1000);
        setIsLoading(false);
      } else {
        console.log("Server sent a bad request")
        setToastMessage(result.message);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 6000);
        setIsLoading(false);
      }
      
    } catch (error) {
      setToastMessage('Error during sign in ' + error);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 6000);
      setIsLoading(false);
    } 
  };
  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 block w-full"
                  placeholder="you@example.com"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 block w-full"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4">
              {buttonText}
              {isLoading && <Loader></Loader>}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button
                  variant="outline"
                  className="w-full inline-flex justify-center py-2 px-4"
                >
                  <Github className="h-5 w-5" />
                  <span className="ml-2">GitHub</span>
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-full inline-flex justify-center py-2 px-4"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="ml-2">Twitter</span>
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Dont have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
                Sign up
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
      {showSuccessToast && <SuccessToast message={toastMessage} />}
      {showErrorToast && <FailureToast message={toastMessage} />}
    </div>
  )
}