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

    // ➕ CREATE ou UPDATE
    const handleSubmit = async () => {
        if (!title) return;

        if (editId) {
            await API.put(`/tasks/${editId}`, {
                title,
                description,
            });
            alert("Tâche modifiée ✏️");
        } else {
            await API.post("/tasks", {
                title,
                description,
                status: "todo",
                priority: "low",
            });
            alert("Tâche ajoutée ✅");
        }

        setTitle("");
        setDescription("");
        setEditId(null);
        fetchTasks();
    };

    // ❌ DELETE
    const deleteTask = async (id: string) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
    };

    // ✏️ EDIT
    const startEdit = (task: Task) => {
        setTitle(task.title);
        setDescription(task.description);
        setEditId(task._id);
    };

    // 🔄 STATUS
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

    // 🎯 FILTER
    const [filter, setFilter] = useState("all");

    const filteredTasks = tasks.filter((task) => {
        if (filter === "done") return task.status === "done";
        if (filter === "todo") return task.status === "todo";
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* HEADER */}
            <div className="max-w-4xl mx-auto flex justify-between mb-6">
                <h1 className="text-2xl font-bold">DevTasks 🚀</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            {/* FILTER */}
            <div className="max-w-4xl mx-auto mb-4 flex gap-2">
                <button onClick={() => setFilter("all")}>Toutes</button>
                <button onClick={() => setFilter("todo")}>À faire</button>
                <button onClick={() => setFilter("done")}>Terminées</button>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow mb-6">
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
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        {editId ? "Modifier" : "Ajouter"}
                    </button>
                </div>
            </div>

            {/* TASKS */}
            <div className="max-w-4xl mx-auto grid gap-4">
                {filteredTasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
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