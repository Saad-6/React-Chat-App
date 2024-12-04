import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Github, Twitter, Phone } from 'lucide-react';
import { Input } from '../Components/UI/input';
import { Button } from '../Components/UI/button';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpModel } from '../Interfaces/SignUpModel';
import { SuccessToast } from '../Components/UI/SuccessToast';
import { FailureToast } from '../Components/UI/FailiureToast';
import { APIResponse } from '../Interfaces/APIResponse';
import { Loader } from '../Components/UI/Loader';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Sign up");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState<SignUpModel>({
    FullName: '',
    Email: '',
    Phone: '',
    Password: '',
    ConfirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:7032/SendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.Phone }),
      });
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setToastMessage('OTP sent successfully');
        setShowSuccessToast(true);
      } else {
        setToastMessage(result.message);
        setShowErrorToast(true);
      }
    } catch (error) {
      setToastMessage('Error sending OTP');
      setShowErrorToast(true);
    }
    setIsLoading(false);
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://localhost:7032/VerifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.Phone, otp }),
      });
      const result = await response.json();
      if (result.success) {
        setPhoneVerified(true);
        setToastMessage('Phone number verified successfully');
        setShowSuccessToast(true);
      } else {
        setToastMessage(result.message);
        setShowErrorToast(true);
      }
    } catch (error) {
      setToastMessage('Error verifying OTP');
      setShowErrorToast(true);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) {
      setToastMessage('Please verify your phone number');
      setShowErrorToast(true);
      return;
    }
    setIsLoading(true);
    if (formData.Password !== formData.ConfirmPassword) {
      setToastMessage('Passwords do not match!');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 6000);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('https://localhost:7032/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result: APIResponse = await res.json();
      if (result.success) {
        setToastMessage(result.message);
        setShowSuccessToast(true);
        setButtonText("You are now being redirected to the login page");
      
        setTimeout(() => {
          setShowSuccessToast(false);
          navigate("/login");
        }, 3000);
      } else {
        setToastMessage(result.message);
        setShowErrorToast(true);
      }
    } catch (error) {
      setToastMessage('Error during sign up ' + error);
      setShowErrorToast(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="FullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="FullName"
                  name="FullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="pl-10 block w-full"
                  placeholder="John Doe"
                  value={formData.FullName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                Email address (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="Email"
                  name="Email"
                  type="email"
                  autoComplete="email"
                  className="pl-10 block w-full"
                  placeholder="you@example.com"
                  value={formData.Email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="Phone"
                  name="Phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="pl-10 block w-full"
                  placeholder="+92 321 00000"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  disabled={phoneVerified}
                />
                <Button
                  type="button"
                  onClick={sendOtp}
                  className="ml-2"
                  disabled={otpSent || phoneVerified}
                >
                  Send Code
                </Button>
              </div>
            </div>

            {otpSent && !phoneVerified && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1 relative rounded-md shadow-sm flex">
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="block w-full"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                  />
                  <Button
                    type="button"
                    onClick={verifyOtp}
                    className="ml-2"
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}

            {phoneVerified && (
              <div className="text-green-600 text-sm">Phone number verified successfully!</div>
            )}

            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10 block w-full"
                  placeholder="••••••••"
                  value={formData.Password}
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

            <div>
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="ConfirmPassword"
                  name="ConfirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10 block w-full"
                  placeholder="••••••••"
                  value={formData.ConfirmPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  >
                    {showConfirmPassword ? (
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
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="font-medium text-primary hover:text-primary-dark">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={!phoneVerified}>
                {buttonText}
                {isLoading && <Loader />}
              </Button>
            </div>
          </form>

          {/* Rest of the component remains the same */}
        </div>
      </div>
      {showSuccessToast && <SuccessToast message={toastMessage} />}
      {showErrorToast && <FailureToast message={toastMessage} />}
    </div>
  );
}