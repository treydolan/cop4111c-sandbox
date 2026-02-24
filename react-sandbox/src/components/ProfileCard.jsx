export default function ProfileCard({ name, role }) {
  return (
    <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
      <h2>{name}</h2>
      <p>{role}</p>
    </section>
  );
}
