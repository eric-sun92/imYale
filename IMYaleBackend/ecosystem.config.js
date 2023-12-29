module.exports = {
    apps: [
        {
            name: "IMYale Backend",
            script: "app.js",
            instances: "max",
            exec_mode: "cluster",
            autorestart: true,
            watch: true,
            env_beta: {
                NODE_ENV: "production",
                RUN_PM2: "true",
                API_URL: "https://beta.imyale.lilbillbiscuit.com/api",
                PORT: 4000,
                CLIENT_URL: "https://beta.imyale.lilbillbiscuit.com",
            },
            env_prod: {
                NODE_ENV: "production",
                RUN_PM2: "true",
                API_URL: "https://imyale.lilbillbiscuit.com/api",
                PORT: 4000,
                CLIENT_URL: "https://imyale.lilbillbiscuit.com",
            }
        }
    ]
};