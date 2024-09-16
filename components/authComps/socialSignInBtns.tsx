import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

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
          <FacebookIcon className="mr-2" /> 
          <span> Facebook</span>
        </a>

        {/* Google Button */}
        <a
          href="#"
          className="flex items-center w-40 justify-center py-3 bg-gray-800 bg-opacity-40  border-2 border-gray-800 text-white rounded-md shadow-md transition-all duration-300 hover:bg-gray-800"
        >
          <GoogleIcon className="mr-2" /> 
          <span> Google</span>
        </a>
      </div>
    </>
  );
}
