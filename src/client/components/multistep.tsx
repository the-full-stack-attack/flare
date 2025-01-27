import React from "react";
import {useState} from "react";

function MultiStep() {
    const message = ["One", "Two", "Three"];


    function Message({step}) {
        return <h2>{message[step - 1]}</h2>;
    }

    const [step, setSteps] = useState(1);

    function handlePrev() {
        if (step > 1) setSteps((step) => step - 1);
    }

    function handleNext() {
        if (step < 3) setSteps((steps) => step + 1);
    }

    return (
        <div className="w-[550px] bg-white p-4 px-8 rounded-lg overflow-x-hidden">
            <div className="flex justify-between my-4 relative">
                <div
                    className="bg-[#630cf1] absolute top-1/2 left-0 h-1 -translate-y-1/2 z-10 transition-all duration-800"></div>
                <div className="bg-gray-300 h-[30px] w-[30px] flex justify-center items-center rounded-full z-10">
                    1
                </div>
                <div className="bg-gray-300 h-[30px] w-[30px] flex justify-center items-center rounded-full z-10">
                    2
                </div>
                <div className="bg-gray-300 h-[30px] w-[30px] flex justify-center items-center rounded-full z-10">
                    3
                </div>
            </div>

            <div className="content">
                <Message step={step}/>
            </div>
            <div className="flex justify-between my-4">
                <button
                    className="outline-none border-none cursor-pointer text-base rounded bg-gray-300 text-black px-10 py-1 cursor-not-allowed"
                    onClick={handlePrev}
                >
                    Prev
                </button>
                <button
                    className="outline-none border-none cursor-pointer text-base rounded bg-[#43766c] text-white px-10 py-1"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default MultiStep;
