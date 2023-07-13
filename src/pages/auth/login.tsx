import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authOptions } from "~/server/auth";

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="fixed max-h-full min-h-full min-w-full max-w-full overflow-hidden bg-gradient-to-br from-[#1c6641] to-[#9DC88D]">
        <div className="absolute inset-0 h-full w-full object-cover">
          <Image src="/bg.png" alt="background" fill={true} />
        </div>
        <section className="flex min-h-screen flex-col items-center justify-center  font-poppins">
          <div className="container mx-auto flex h-full items-center justify-center px-6 py-12">
            <div className="bg-white px-8 py-10 shadow-xl shadow-black/30 backdrop-blur-sm md:w-8/12 lg:w-5/12">
              <LoginForm providers={providers} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export const LoginForm = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchBar = useSearchParams();
  const searchQuery = searchBar.get("prev");
  const callbackURL = searchQuery ? encodeURI(searchQuery) : "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl: "/",
      });

      if (res?.ok) {
        router.push(callbackURL);
      }
    } catch (error) {
      setError(JSON.stringify(error));
    }
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <form onSubmit={(e) => void onSubmit(e)}>
      {error && (
        <p className="mb-6 rounded bg-red-300 py-4 text-center">{error}</p>
      )}
      <div className="mb-6 rounded border-2 border-solid border-[#1c6641]">
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={(e) =>
            setFormValues({ ...formValues, email: e.target.value })
          }
          placeholder="Email address"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6 rounded border-2 border-solid border-[#1c6641]">
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={(e) =>
            setFormValues({ ...formValues, password: e.target.value })
          }
          placeholder="Password"
          className={`${input_style}`}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="inline-block w-80 rounded-lg bg-[#164A41] px-7 py-4 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-[#297753] hover:shadow-lg focus:bg-[#1c6641] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#164A41] active:shadow-lg"
        >
          Sign In
        </button>
      </div>

      <div className="my-4 flex items-center  before:mt-0.5 before:flex-1 before:border-t before:border-[#164A41] after:mt-0.5 after:flex-1 after:border-t after:border-[#164A41]">
        <p className="mx-4 mb-0 text-center italic">
          Don´t have an account yet?
        </p>
      </div>

      {Object.values(providers)
        .filter((provider) => provider.name !== "credentials")
        .map((provider) => (
          <>
            {provider.name !== "Discord" && (
              <div key={provider.name}>
                <button onClick={() => void signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            )}
          </>
        ))}

      <div
        className="flex items-center justify-center text-center"
        onClick={() => router.push(`/auth/signup?prev=${callbackURL}`)}
      >
        <button className="block w-80 rounded-lg bg-[#F1B24A] px-7 py-4 text-sm font-semibold uppercase leading-snug text-[#164A41] shadow-md transition duration-150 ease-in-out hover:bg-[#ea9812] hover:shadow-lg focus:bg-[#ffb735] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#ffb735] active:shadow-lg">
          <p>Sign Up</p>
        </button>
      </div>
    </form>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
