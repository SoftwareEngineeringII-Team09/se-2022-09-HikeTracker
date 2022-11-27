const navigation = {
    desktop: [
        { label: "Browse", url: "/browse", variant: "link", users: ["All"] },
        { label: "Login", url: "/login", variant: "link", users: ["Visitor"] },
        { label: "Create an account", url: "/signup", variant: "button", users: ["Visitor"] },
    ],
    desktopGuide: [
        { label: "Browse", url: "/browse", variant: "link" },
        { label: "MyHikes", url: "/hikes", variant: "link" },
        { label: "MyHuts", url: "/huts", variant: "link" },
        { label: "Account", url: "/account", variant: "link" },
    ],
    mobile: [
        { label: "Browse", url: "/browse" },
        { label: "Login", url: "/login" },
    ],
    mobileGuide: [
        { label: "Browse", url: "/browse" },
        { label: "Account", url: "/account" },
        { label: "MyHikes", url: "/hikes" },
        { label: "MyHuts", url: "/huts" },
    ]
}

export default navigation