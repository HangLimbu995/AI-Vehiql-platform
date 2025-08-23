import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const layout = ({ children }) => {
  return (
    <ClerkProvider>
      <div className="flex justify-center pt-40">{children}</div>
     </ClerkProvider>
  );
};

export default layout;
