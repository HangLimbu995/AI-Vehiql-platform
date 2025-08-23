import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <div>
      <SignIn signUpUrl='/sign-up'/>
    </div>
  )
}

export default SignInPage
