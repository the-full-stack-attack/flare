import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  ref,
  useId,
  lazy,
  Suspense,
} from 'react';

function Menu({ toggleDJ, djgamePic, toggleFlamiliar, smallBartender }) {
  return (
    <div className=" col-span-2 ">
      <div className="grid grid-cols-2 ">
        <div className="">
          <div
            onClick={toggleDJ}
            className="flex flex-col bg-gradient-to-br from-black via-gray-900 to-pink-900 shadow-sm border border-fuchsia-200 hover:border-4 hover:border-cyan-400 rounded-lg my-6 "
          >
            <h4 className="p-6 text-center mb-1 text-xl font-semibold text-slate-100">
              Mixed Signals
            </h4>
            <div className="m-2.5 overflow-hidden rounded-md flex justify-center items-center ">
              <img
                className="h-80 object-cover "
                src={djgamePic}
                alt="profile-picture"
              />
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-semibold text-slate-100 uppercase">
                <em>Communicate With Music!</em>
              </p>
              <p className="text-base text-xs text-slate-200 mt-4 font-light ">
                Have fun recording a beat, then publish it for others in the
                chat to hear! Listen, Layer and/or combine your beats with
                others!
              </p>
            </div>
            <div className="flex justify-center p-6 pt-2 gap-7">
              <button
                onClick={toggleDJ}
                className="min-w-32 rounded-md bg-black py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-cyan-500 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Play Mixed Signals!
              </button>
            </div>
          </div>
        </div>
        <div onClick={toggleFlamiliar}>
          <div className="flex flex-col bg-gradient-to-br from-black via-gray-900 to-pink-900 shadow-sm border border-fuchsia-200 hover:border-4 hover:border-cyan-400 rounded-lg my-6   ">
            <h4 className="p-6 text-center mb-1 text-xl font-semibold text-slate-100">
              Flamiliar
            </h4>
            <div className="m-2.5 overflow-hidden rounded-md flex justify-center items-center ">
              <img
                className="h-80 object-cover border-fuchsia-500"
                src={smallBartender}
                alt="profile-picture"
              />
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-semibold text-slate-100 uppercase">
                <em>Get Flamiliar with each other!</em>
              </p>
              <p className="text-base text-xs text-slate-200 mt-4 font-light ">
                Our AI Bartender gives you a sentence, and players must finish
                it! Then vote for who had the best response!
              </p>
            </div>
            <div className="flex justify-center p-6 pt-2 gap-7">
              <button
                onClick={toggleFlamiliar}
                className="min-w-32 rounded-md bg-black py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-cyan-500 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Play Flamiliar!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
