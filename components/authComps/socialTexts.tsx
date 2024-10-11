const SocialTexts = () => {
  return (
    <div className="panels-container absolute h-full w-full top-0 left-0 grid grid-cols-2 max-lg2:grid-cols-[1fr] max-lg2:grid-rows-[1fr,2fr,1fr]">
      <div className="panel left-panel flex flex-col items-center justify-around text-center z-[6] pointer-events-auto pr-[12%] pt-12 pb-8 pl-[17%] max-lg2:flex-row max-lg2:justify-around max-lg2:items-center max-lg2:py-[2.5rem] max-lg2:px-[8%] max-lg2:col-[1/2] max-lg2:row-[1/2] ">
        <div className="content text-gray-300 max-lg2:pr-[15%] max-xs:py-2 max-xs:px-4 ">
          <h3 className="font-bold leading-none text-[1.8rem]">
            Welcome to Simple Chat
          </h3>
          <p className="text-[0.95rem] py-2 mt-3">
            Please sign in to continue chatting <span className="max-sm:hidden"> with your <br /> friends and stay
            connected.</span>
          </p>
        </div>
        <div className="image" />
      </div>
    </div>
  );
};

export default SocialTexts;
