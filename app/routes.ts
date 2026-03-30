import { route } from "@react-router/dev/routes";

export default [
    route("/", "./routes/home.tsx"),
    route("/login", "./routes/login.tsx"),
    route("/dashboard", "./routes/dashboard.tsx"),
];
