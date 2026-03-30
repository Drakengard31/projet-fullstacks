import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../services/api";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Remplis tous les champs");
            return;
        }

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow w-80">
                <h1 className="text-xl font-bold mb-4 text-center">Connexion</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    className="border p-2 rounded w-full mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full py-2 rounded"
                >
                    Se connecter
                </button>
            </div>
        </div>
    );
}