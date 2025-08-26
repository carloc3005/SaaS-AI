import { SimpleSignInView } from "@/components/simple-sign-in";

const SignInPage = async () => {
  console.log("Sign-in page server component loaded - MINIMAL VERSION");
  
  return <SimpleSignInView />;
};

export default SignInPage;
