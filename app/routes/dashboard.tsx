import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../services/api";

type Task = {
    _id: string;
    title: string;
    description: string;
};

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 🔐 protection
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, []);

    // 📦 fetch
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await API.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ➕ create
    const createTask = async () => {
        if (!title) {
            alert("Le titre est obligatoire");
            return;
        }

        try {
            await API.post("/tasks", {
                title,
                description,
                status: "todo",
                priority: "low",
            });

            setTitle("");
            setDescription("");

            alert("Tâche ajoutée ✅");
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // ❌ delete
    const deleteTask = async (id: string) => {
        try {
            await API.delete(`/tasks/${id}`);
            alert("Tâche supprimée ❌");
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // 🚪 logout
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* HEADER */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">DevTasks 🚀</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow mb-6">
                <h2 className="font-semibold mb-3">Ajouter une tâche</h2>

                <div className="flex gap-2">
                    <input
                        className="border p-2 rounded w-1/3"
                        placeholder="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        className="border p-2 rounded w-1/3"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        onClick={createTask}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            {/* LOADING */}
            {loading && <p className="text-center">Chargement...</p>}

            {/* EMPTY */}
            {!loading && tasks.length === 0 && (
                <p className="text-center text-gray-500">
                    Aucune tâche pour le moment 👀
                </p>
            )}

            {/* TASKS */}
            <div className="max-w-4xl mx-auto grid gap-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold">{task.title}</h3>
                            <p className="text-gray-500">{task.description}</p>
                        </div>

                        <button
                            onClick={() => deleteTask(task._id)}
                            className="bg-red-400 text-white px-3 py-1 rounded"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}