import React from "react";
import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderCircle className="h-10 w-10 animate-spin text-gray-700" />
      <span className="ml-2 text-gray-700">Loading...</span>
    </div>
  );
};

export default Loader;
