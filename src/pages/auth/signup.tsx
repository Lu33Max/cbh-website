import type { NextPage } from "next";
import React, { useState } from "react";

import { signUpSchema, type ISignUp } from "../../common/validation/auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const SignUp: NextPage = () => {
  return (
    <>
    <div className="relative bg-gradient-to-br from-[#1c6641] to-[#9DC88D]">
      <div className="absolute inset-0 w-full h-full object-cover">
        <Image src="/bg.png" alt="Hintergrundbild" fill={true} />
      </div>
      <section className="min-h-screen flex flex-col justify-center items-center  font-poppins">
        <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
          <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10 backdrop-blur-sm shadow-xl shadow-black/30">
            <SignUpForm />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

const SignUpForm = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<ISignUp>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchBar = useSearchParams();
  const searchQuery = searchBar.get('prev');
  const callbackURL = searchQuery ? encodeURI(searchQuery) : "/";

  const createUser = api.auth.signup.useMutation();

  async function onSubmit() {
    try {
      const data = await signUpSchema.parseAsync(formValues);
      try {
        await createUser.mutateAsync(data);
        
        const res = await signIn('credentials', {
          redirect: false,
          email: formValues.email,
          password: formValues.password,
          callbackUrl: "/"
        });
  
        if(res?.ok){
          void router.push(callbackURL)
        }

      } catch(error){
        setError("Email already exists");
      }  
    } catch (error) {
      setError("Not a valid input type")
    }
  }

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return(
    <div>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      <div className="mb-6 border-solid border-2 border-[#1c6641] rounded">
        <input
          required
          type="text"
          name="username"
          value={formValues.username}
          onChange={e => setFormValues({...formValues, username: e.target.value})}
          placeholder="Username"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6 border-solid border-2 border-[#1c6641] rounded">
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={e => setFormValues({...formValues, email: e.target.value})}
          placeholder="Email address"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6 border-solid border-2 border-[#1c6641] rounded">
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={e => setFormValues({...formValues, password: e.target.value})}
          placeholder="Password"
          className={`${input_style}`}
        />
      </div>
      <div className="flex justify-center items-center">
        <button
          className="inline-block px-7 py-4 bg-[#164A41] text-white rounded-lg font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[#297753] hover:shadow-lg focus:bg-[#1c6641] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#164A41] active:shadow-lg transition duration-150 ease-in-out w-80"
          onClick={() => void onSubmit()}
        >
          Sign Up
        </button>
      </div>

      <div className="flex items-center my-4 before:flex-1 before:border-t before:border-[#164A41] before:mt-0.5 after:flex-1 after:border-t after:border-[#164A41] after:mt-0.5">
        <p className="text-center italic mx-4 mb-0">Already have an account?</p>
      </div>

      <div className="text-center flex justify-center items-center" onClick={() => void router.push(`/auth/login?prev=${callbackURL}`)}>
        <button className="block w-80 px-7 py-4 bg-[#F1B24A] rounded-lg text-[#164A41] font-semibold font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-[#ea9812] hover:shadow-lg focus:bg-[#ffb735] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#ffb735] active:shadow-lg transition duration-150 ease-in-out">
          <p>Sign In</p>
        </button> 
      </div>
    </div>
  )
}

export default SignUp;
