import { Mail } from "lucide-react";
import SocialSignIn from "./socialSignInBtns";
import { Dispatch, SetStateAction } from "react";
import { LoadingButton } from "../ui/loadingbutton";

interface FormContentProps {
  headingText: string;
  submitBtnValue: string;
  isLoading: boolean;
  setFormData: Dispatch<SetStateAction<{ email: string }>>;
}

const FormContent: React.FC<FormContentProps> = ({
  headingText,
  submitBtnValue,
  isLoading,
  setFormData,
}) => {
  return (
    <>
      <h2 className="title text-2xl text-gray-300 mb-2.5">{headingText}</h2>
      <div className="input-field max-w-[380px] w-full bg-gray-800 my-2 h-[55px] rounded-md grid grid-cols-[15%_85%] pl-[0.4rem] relative group border-2 border-transparent focus-within:border-gray-500">
        <Mail
          className="top-1/2 relative -translate-y-1/2 translate-x-1"
          size={24}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="bg-transparent outline-none rounded-r-full leading-tight font-semibold text-[1.1rem] text-gray-100 focus:outline-none"
        />
      </div>
      <LoadingButton
        className="btn solid w-[150px] flex justify-center items-center active:scale-90 disabled:scale-90 disabled:bg-[#373f4e] disabled:hover:bg-[#373f4e] disabled:cursor-not-allowed text-center bg-blue-600 hover:bg-blue-500 border-none outline-none h-[49px] rounded-md text-white uppercase font-semibold my-2.5 cursor-pointer transition duration-300 "
        isLoading={isLoading}
        
      >
        {submitBtnValue}
      </LoadingButton>

        <SocialSignIn />
      
      <div className="text-center w-full mt-6">
        <p className="text-[0.85rem] text-gray-400">
          By signing up, you agree to our
          <a
            href="/privacy-policy"
            className="text-blue-500 ml-1 hover:underline underline-offset-2 py-1"
          >
            Privacy Policy
          </a>{" "}
          and
          <a
            href="/terms-of-service"
            className="text-blue-500 ml-1 hover:underline underline-offset-2 py-1"
          >
            Terms of Service
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default FormContent;
