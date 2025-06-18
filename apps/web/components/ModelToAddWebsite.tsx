import { useState } from "react";
import { Button } from "./Button";

interface modelProps {
  open: boolean;
  onClose: () => void;
}
export function ContentModel({ open, onClose }: modelProps) {
  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-amber-200 fixed top-0 left-0 opacity-20 flex justify-center">
          <div className="flex flex-col justify-center">
            <span className="bg-white  p-4 rouded-md">
              <div className="flex justify-end">
                <div onClick={onClose} className="cursor-pointer">
                  <CrossIcon />
                </div>
              </div>
              <div className="flex flex-col">
                <InputBox placeholder="Title" />
                <InputBox placeholder="Link" />
              </div>
              <Button variant={"primary"} text={"submit"} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface InputBoxProps {
  placeholder: string;
  onChange?: () => void;
}

export function InputBox({ placeholder, onChange }: InputBoxProps) {
  return (
    <>
      <input
        type={"text"}
        className="px-4 py-2 border-2 border-solid border-black text-black"
        onChange={onChange}
      ></input>
    </>
  );
}

export function CrossIcon() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4 bg-black"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </>
  );
}