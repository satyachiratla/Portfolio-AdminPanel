import Layout from "../components/layout";
import Profile from "../components/profile";

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-5xl text-cyan-300 text-center mt-6">
        Welcome Vivek Chowdary
      </h1>
      <p className="text-teal-400 text-center mt-2">Update your Portfolio 😛</p>
      <Profile />
    </Layout>
  );
}
