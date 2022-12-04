const __DEFAULT_NAVIGATION = [
    { label: "Browse hikes", url: "/hikes", variant: "link" }
]

const navigation = {
    Visitor: [
        { label: "Login", url: "/login", variant: "link" },
        { label: "Create an account", url: "/signup", variant: "button" },
    ],
    Hiker: [
        { label: "Search huts", url: "/huts", variant: "link" },
    ],
    LocalGuide: [
        { label: "My hikes", url: "/account/hikes" },
        { label: "Create a new hike", url: "/account/hikes/add" },
        { label: "My Huts", url: "/account/huts" },
        { label: "Create a new hut", url: "/account/huts/add" },
        { label: "Create a new parking lot", url: "/account/parking-lots/add" },
    ],
}

export default (role) => __DEFAULT_NAVIGATION.concat(navigation[role])