'use client'

import { Dispatch, SetStateAction } from "react";

interface SocialTextsProps{
  setShowSignUp: Dispatch<SetStateAction<boolean>>,
  showVerification: boolean
}

const SocialTexts: React.FC<SocialTextsProps> = ({ setShowSignUp, showVerification }) => {
  return (
    <div className="panels-container absolute h-full w-full top-0 left-0 grid grid-cols-2 max-lg2:grid-cols-[1fr] max-lg2:grid-rows-[1fr,2fr,1fr]">
      <div className="panel left-panel flex flex-col items-end justify-around text-center z-[6] pointer-events-auto pr-[12%] pt-12 pb-8 pl-[17%] max-lg2:flex-row max-lg2:justify-around max-lg2:items-center max-lg2:py-[2.5rem] max-lg2:px-[8%] max-lg2:col-[1/2] max-lg2:row-[1/2] ">
        <div className="content text-gray-300 transition-transform duration-[600ms] ease-in-out delay-[400ms] max-lg2:pr-[15%] max-xs:py-2 max-xs:px-4 ">
          <h3 className="font-semibold leading-none text-[1.5rem]">
            New to Simple Chat?
          </h3>
          <p className="text-[0.95rem] py-2 font-bold">
            Jump right in! Start chatting with people. Simple Chat keeps it... well, simple.
          </p>
          <button
            className="btn m-0 border-2 active:scale-90 disabled:cursor-not-allowed border-gray-400 hover:bg-gray-500 hover:bg-opacity-40 rounded-md transition duration-300 bg-transparent w-[130px] h-[41px] font-semibold text-[0.8rem]"
            id="sign-up-btn"
            onClick={() => {
              setShowSignUp(true)
            }}
            disabled={showVerification}
          >
            Sign Up
          </button>
        </div>
        <div className="image" />
      </div>

      <div className="panel right-panel flex flex-col items-end justify-around text-center z-[6] pointer-events-none p-12 pt-12 pb-8 pr-[17%] max-lg2:flex-row max-lg2:justify-around max-lg2:items-center max-lg2:py-[2.5rem] max-lg2:px-[8%] max-lg2:col-[1/2] max-lg2:row-[3/4]">
        <div className="content text-white transition-transform duration-[600ms] ease-in-out delay-[400ms] transform translate-x-[800px] max-lg2:pr-[15%] max-xs:py-2 max-xs:px-4">
          <h3 className="font-semibold leading-none text-[1.5rem]">
            Have an Account?
          </h3>
          <p className="text-[0.95rem] py-2">
            Welcome back! Hop back in and catch up on your chats. We&apos;ve been waiting for you.
          </p>
          <button
            className="btn active:scale-90 disabled:cursor-not-allowed m-0 border-2 border-gray-400 hover:bg-gray-500 hover:bg-opacity-40 rounded-md transition duration-300 bg-transparent w-[130px] h-[41px] font-semibold text-[0.8rem]"
            id="sign-in-btn"
            onClick={() => {
              setShowSignUp(false)
            }}
            disabled={showVerification}
          >
            Sign In
          </button>
        </div>
        <div aria-hidden className="image transform translate-x-[800px]" />
      </div>

      
    </div>
  );
}

export default SocialTexts;
