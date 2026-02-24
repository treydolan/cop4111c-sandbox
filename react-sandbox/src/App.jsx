import ProfileCard from "./components/ProfileCard";
import MyButton from "./components/MyButton";

export default function App() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>React Sandbox</h1>

      <ProfileCard name="Your Name" role="Web Developer" />
      <ProfileCard name="Another Person" role="Designer" />
      <MyButton />
    </main>
  );
}
