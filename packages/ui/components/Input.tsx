import React from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Input({
  className = "",
  name = "input",
  inputType = "text",
  label = "",
  inputProps,
  error,
}: {
  className?: string;
  name: string;
  inputType?: string;
  label?: string;
  inputProps?: {
    required?: boolean;
    autoComplete?: string;
    placeholder?: string;
  };
  error?: { message: string };
}) {
  console.log("error: ", error);
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={inputType}
          className={classNames(
            "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm",
            error
              ? "border-red-400 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          )}
          {...inputProps}
        />
      </div>
      <div className="mt-1 text-red-500 text-xs font-normal">
        {error?.message}
      </div>
    </div>
  );
}
