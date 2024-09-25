"use client";

import { FaGoogle } from "react-icons/fa";

export default function SocialSignIn() {
  

  return (
    <>
      <p className="social-text py-2 text-base text-gray-500 text-center">
        Or Sign in with Google
      </p>
      <div className="social-media flex justify-center ">
        <button
          className="bg-gray-800 border-2 flex justify-center items-center gap-0 rounded-md border-gray-800 bg-opacity-60 py-3 px-5 hover:bg-gray-700 hover:bg-opacity-70 transition-all duration-200"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
          }}
        >
          <FaGoogle className="mr-2" size={24} /> Sign In With Google
        </button>
      </div>
    </>
  );
}
