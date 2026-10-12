import Changes from "../../../components/Change";

const page = () => {
  return (
    <Changes
      title="Password Updated"
      description="Your password has been changed. Continue to sign in."
      link1="/SignIn"
      link2="/"
      button1="Back to Sign In"
    />
  );
};
export default page;
