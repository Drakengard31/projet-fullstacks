import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../services/api";

type Task = {
    _id: string;
    title: string;
    description: string;
    status: string;
};

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        const res = await API.get("/tasks");
        setTasks(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async () => {
        if (!title) return;

        if (editId) {
            await API.put(`/tasks/${editId}`, {
                title,
                description,
            });
        } else {
            await API.post("/tasks", {
                title,
                description,
                status: "todo",
                priority: "low",
            });
        }

        setTitle("");
        setDescription("");
        setEditId(null);
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const startEdit = (task: Task) => {
        setTitle(task.title);
        setDescription(task.description);
        setEditId(task._id);
    };

    const toggleStatus = async (task: Task) => {
        await API.put(`/tasks/${task._id}`, {
            ...task,
            status: task.status === "todo" ? "done" : "todo",
        });
        fetchTasks();
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "done") return task.status === "done";
        if (filter === "todo") return task.status === "todo";
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
            {/* HEADER */}
            <div className="max-w-4xl mx-auto flex justify-between mb-6">
                <h1 className="text-2xl font-bold">DevTasks 🚀</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            {/* FILTER */}
            <div className="max-w-4xl mx-auto mb-4 flex gap-2">
                <button onClick={() => setFilter("all")} className="bg-gray-200 px-3 py-1 rounded">
                    Toutes
                </button>
                <button onClick={() => setFilter("todo")} className="bg-yellow-200 px-3 py-1 rounded">
                    À faire
                </button>
                <button onClick={() => setFilter("done")} className="bg-green-200 px-3 py-1 rounded">
                    Terminées
                </button>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow mb-6">
                <div className="flex gap-2">
                    <input
                        className="border p-2 rounded w-1/3 text-gray-900"
                        placeholder="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        className="border p-2 rounded w-1/3 text-gray-900"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        {editId ? "Modifier" : "Ajouter"}
                    </button>
                </div>
            </div>

            {/* LOADING */}
            {loading && <p className="text-center">Chargement...</p>}

            {/* EMPTY */}
            {!loading && filteredTasks.length === 0 && (
                <p className="text-center text-gray-500">
                    Aucune tâche 👀
                </p>
            )}

            {/* TASKS */}
            <div className="max-w-4xl mx-auto grid gap-4">
                {filteredTasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
                    >
                        <div>
                            <h3 className={`font-bold ${task.status === "done" ? "line-through" : ""}`}>
                                {task.title}
                            </h3>
                            <p className="text-gray-500">{task.description}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => toggleStatus(task)}>
                                {task.status === "done" ? "Undo" : "Done"}
                            </button>

                            <button onClick={() => startEdit(task)}>✏️</button>

                            <button onClick={() => deleteTask(task._id)}>❌</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}