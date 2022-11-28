const navigation = {
    default: {
        desktop: [
            { label: "Browse", url: "/browse", variant: "link" },
            { label: "Login", url: "/login", variant: "link" },
            { label: "Create an account", url: "/signup", variant: "button" },
        ],
        mobile: [
            { label: "Browse", url: "/browse" },
            { label: "Login", url: "/login" },
        ]
    },
    Hiker: [
        { label: "Browse", url: "/browse", variant: "link" },
    ],
    LocalGuide: [
        { label: "Browse", url: "/browse", variant: "link" },
        { label: "Create a new hike", url: "/hikes/add" },
        { label: "Create a new hut", url: "/huts/add" },
        { label: "Create a new parking lot", url: "/add-parking-lot" },
    ],
}

export default navigation