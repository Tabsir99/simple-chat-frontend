"use client";

import SocialTexts from "@/components/authComps/socialTexts";
import { useState } from "react";
import FormContent from "@/components/authComps/formContent";

export default function AuthComponent() {
  const [showSignUp, SetShowSignUp] = useState(false);

  return (
    <>
      <div
        className={
          "container relative w-full bg-gray-900 min-h-screen overflow-hidden max-lg2:min-h-[800px] max-lg2:h-screen " +
          (showSignUp && "sign-up-mode")
        }
      >
        <div className="forms-container absolute w-full h-full top-0 left-0">
          <div className="signin-signup absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 left-3/4 w-1/2 delay-500 ease-in-out grid grid-cols-1 z-[5] max-lg2:w-full max-lg2:top-[95%] max-lg2:-translate-x-1/2 max-lg2:-translate-y-full ">
            <form
              action="#"
              className="sign-in-form z-[2] delay-500 flex items-center justify-center flex-col px-20 overflow-hidden col-span-full row-span-full max-xs:py-0 max-xs:px-6"
            >
              <FormContent
                isSignUp={false}
                headingText="Sign In"
                submitBtnValue="Sign In"
                
              />


            </form>
            <form
              action="#"
              className="sign-up-form opacity-0 delay-500 z-[1] flex items-center justify-center flex-col px-20 overflow-hidden col-span-full row-span-full max-xs:py-0 max-xs:px-6"
            >
              <FormContent
                isSignUp={true}
                headingText="Sign Up"
                submitBtnValue="Sign Up"
              />
            </form>
          </div>
        </div>

        <SocialTexts setShowSignUp={SetShowSignUp} />
      </div>
    </>
  );
}
