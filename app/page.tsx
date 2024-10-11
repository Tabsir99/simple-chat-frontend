"use client";

import SocialTexts from "@/components/authComps/socialTexts";
import { FormEvent, useEffect, useState } from "react";
import FormContent from "@/components/authComps/formContent";
import { PublicRoute } from "@/components/authComps/authcontext";

export default function AuthComponent() {
  const [showResponse, setShowResponse] = useState({
    success: false,
    faliure: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  useEffect(() => {
    const handleMessage = () => {
      window.location.assign("/chats");
    };
    const channel = new BroadcastChannel("c1");
    channel.addEventListener("message", handleMessage, { once: true });

    return () => channel.close()
  }, []);

  return (
    <PublicRoute>
    <div
      className={
        "container relative min-w-[100vw] bg-gray-900 min-h-screen overflow-hidden max-lg2:min-h-[800px] max-lg2:h-screen "
      }
    >
      <div className="forms-container absolute w-full h-full top-0 left-0">
        <div
          className={`signin-signup absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-3/4 w-1/2 delay-500 ease-in-out grid grid-cols-1 z-[5] max-lg2:w-full max-lg2:top-[95%] max-lg2:-translate-x-1/2 max-lg2:-translate-y-full`}
        >
          {!showResponse.success ? (
            <>
              <form
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  if (!formData.email) {
                    setShowResponse({
                      faliure: "Please Enter an email",
                      success: false
                    })
                    return;
                  }
                  if(!formData.email.includes("@")){
                    setShowResponse({
                      faliure: "Please Enter a valid email",
                      success: false
                    })
                    return;
                  }


                  setIsLoading(true);


                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/send-verification-email`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(formData),
                    }
                  );
                  if(response.ok){
                    setIsLoading(false);
                    setShowResponse({
                      faliure: "",
                      success: true
                    });
                  }
                  else{
                    setShowResponse({
                      faliure: "Failed to send email, Please try again",
                      success:false
                    })
                  }
                }}
                className={`sign-in-form z-[2] delay-500 flex items-center justify-center flex-col px-20 overflow-hidden col-span-full row-span-full max-xs:py-0 max-xs:px-6 ${
                  showResponse.success ? "animate-slide-left-out" : ""
                }`}
              >
                <FormContent
                  headingText="Sign In"
                  submitBtnValue="Sign In"
                  isLoading={isLoading}
                  setFormData={setFormData}
                  showFaliure={showResponse.faliure}
                />
              </form>
            </>
          ) : (
            <div
              className={`flex flex-col items-center gap-4 text-balance px-6 py-8 bg-gray-800 bg-opacity-60 text-gray-200 rounded-lg shadow-lg border border-gray-700 max-w-[35rem] mx-auto max-xs:px-4 max-xs:py-6 animate-slide-left-in`}
            >
              <h2 className="text-2xl font-bold text-center">
                Thank you for your patience!
              </h2>
              <p className="text-[18px] text-center">
                A verification link has been sent to{" "}
                <span className="text-blue-400">{formData.email}</span>. Click
                it to complete verification and start chatting!
              </p>
              <span className="text-sm text-gray-400 text-center">
                Be sure to check your spam folder if you can&apos;t find it!
              </span>
            </div>
          )}
        </div>
      </div>

      <SocialTexts />
    </div>
    </PublicRoute>
  );
}
