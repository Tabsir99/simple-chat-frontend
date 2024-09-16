"use client";

import SocialTexts from "@/components/authComps/socialTexts";
import { FormEvent, useState } from "react";
import FormContent from "@/components/authComps/formContent";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function AuthComponent() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router: AppRouterInstance = useRouter()

  return (
    <div
      className={
        "container relative w-full bg-gray-900 min-h-screen overflow-hidden max-lg2:min-h-[800px] max-lg2:h-screen " +
        (showSignUp && "sign-up-mode")
      }
    >
      <div className="forms-container absolute w-full h-full top-0 left-0">
        <div
          className={`signin-signup absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-3/4 w-1/2 delay-500 ease-in-out grid grid-cols-1 z-[5] max-lg2:w-full max-lg2:top-[95%] max-lg2:-translate-x-1/2 max-lg2:-translate-y-full`}
        >
          {!showVerification ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  await new Promise((res) => setTimeout(res, 3000)); // Simulate form submission delay
                  setIsLoading(false);
                  setShowVerification(true);

                  router.push('/chats')
                  
                }}
                className={`sign-in-form z-[2] delay-500 flex items-center justify-center flex-col px-20 overflow-hidden col-span-full row-span-full max-xs:py-0 max-xs:px-6 ${
                  showVerification ? "animate-slide-left-out" : ""
                }`}
              >
                <FormContent
                  isSignUp={false}
                  headingText="Sign In"
                  submitBtnValue="Sign In"
                  isLoading={isLoading}
                />
              </form>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  await new Promise((res) => setTimeout(res, 3000)); // Simulate form submission delay
                  setIsLoading(false);
                  setShowVerification(true);
                }}
                className={`sign-up-form opacity-0 delay-500 z-[1] flex items-center justify-center flex-col px-20 overflow-hidden col-span-full row-span-full max-xs:py-0 max-xs:px-6 ${
                  showVerification ? "animate-slide-left-out" : ""
                }`}
              >
                <FormContent
                  isSignUp={true}
                  headingText="Sign Up"
                  submitBtnValue="Sign Up"
                  isLoading={isLoading}
                />
              </form>
            </>
          ) : (
            <div
              className={`flex flex-col items-center gap-4 text-balance px-6 py-8 bg-gray-800 bg-opacity-60 text-gray-200 rounded-lg shadow-lg border border-gray-700 max-w-[35rem] mx-auto max-xs:px-4 max-xs:py-6 animate-slide-left-in`}
            >
              {showSignUp ? (
                <>
                  <h2 className="text-2xl font-bold text-center">
                    Thank you for your patience!
                  </h2>
                  <p className="text-[18px] text-center">
                    A verification link has been sent to{" "}
                    <span className="text-blue-400">hello@example.com</span>.
                    Click it to complete verification and start chatting!
                  </p>
                  <span className="text-sm text-gray-400 text-center">
                    Be sure to check your spam folder if you can&apos;t find it!
                  </span>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center">
                    Welcome Back!
                  </h2>
                  <p className="text-[18px] text-center">
                    You&apos;re successfully signed in. We're preparing your
                    account and redirecting you to your chat dashboard.
                  </p>
                  <span className="text-sm text-gray-400 text-center">
                    If you aren&apos;t redirected automatically,{" "}
                    <a href="#" className="text-blue-400 underline">
                      click here
                    </a>
                    .
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <SocialTexts
        setShowSignUp={setShowSignUp}
        showVerification={showVerification}
      />
    </div>
  );
}
