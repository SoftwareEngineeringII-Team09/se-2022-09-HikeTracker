const navigation = {
    desktop: [
        { label: "Browse", url: "/browse", variant: "link", users: ["All"] },
        { label: "Login", url: "/login", variant: "link", users: ["Visitor"] },
        { label: "Create an account", url: "/signup", variant: "button", users: ["Visitor"] },
    ],
    mobile: [
        { label: "Browse", url: "/browse", users: ["All"] },
        { label: "Login", url: "/login", users: ["Visitor"] },
        { label: "Register", url: "/signup", users: ["Visitor"] },
    ]
}

export default navigation