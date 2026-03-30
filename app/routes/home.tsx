export function meta() {
  return [
    { title: "DevTasks" },
    { name: "description", content: "App de gestion de tâches" },
  ];
}

export default function Home() {
  return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>DevTasks 🚀</h1>
        <p>Bienvenue sur ton application de gestion de tâches</p>

        <div style={{ marginTop: "20px" }}>
          <a href="/login">
            <button>Se connecter</button>
          </a>
        </div>
      </div>
  );
}