// src/services/authService.js

const USERS_KEY = "users";
const AUTH_KEY = "auth";

/* ------------------ HELPERS ------------------ */
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveAuth = (data) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

const getAuth = () => {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
};

const clearAuth = () => {
    localStorage.removeItem(AUTH_KEY);
};

/* ------------------ SERVICES ------------------ */
export const authService = {
    signup: async ({ email, password }) => {
        const users = getUsers();

        const exists = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
            throw new Error("User already exists");
        }

        const newUser = {
            id: Date.now(),
            email,
            password, // ⚠️ demo only
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        saveUsers(users);

        const authData = {
            user: { id: newUser.id, email: newUser.email },
            token: "fake-jwt-token",
        };

        saveAuth(authData);
        return authData;
    },

    login: async ({ email, password }) => {
        const users = getUsers();

        const user = users.find(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.password === password
        );

        if (!user) {
            throw new Error("Wrong email or password");
        }

        const authData = {
            user: { id: user.id, email: user.email },
            token: "fake-jwt-token",
        };

        saveAuth(authData);
        return authData;
    },

    logout: async () => {
        clearAuth();
        return true;
    },

    forgotPassword: async (email) => {
        const users = getUsers();
        const exists = users.find((u) => u.email === email);

        if (!exists) {
            throw new Error("Email not found");
        }

        // simulate email send
        return true;
    },

    getCurrentAuth: () => {
        return getAuth();
    },
};
