import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div>
      <SignUp signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;
