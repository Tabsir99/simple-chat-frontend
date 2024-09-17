import { FaFacebook, FaGoogle } from 'react-icons/fa';

export default function SocialSignIn() {
  return (
    <>
      <p className="social-text py-2 text-base text-gray-500 text-center">
        Or Sign in with social platforms
      </p>
      <div className="social-media flex justify-center space-x-4">
        {/* Facebook Button */}
        <a
          href="#"
          className="flex items-center w-40 justify-center py-3 bg-gray-800 bg-opacity-40 border-2 border-gray-800 text-white rounded-md shadow-md transition-all duration-300 hover:bg-gray-800"
        >
          <FaFacebook className="mr-2" size={20} /> 
          <span> Facebook</span>
        </a>

        {/* Google Button */}
        <a
          href="#"
          className="flex items-center w-40 justify-center py-3 bg-gray-800 bg-opacity-40 border-2 border-gray-800 text-white rounded-md shadow-md transition-all duration-300 hover:bg-gray-800"
        >
          <FaGoogle className="mr-2" size={20} /> 
          <span> Google</span>
        </a>
      </div>
    </>
  );
}
