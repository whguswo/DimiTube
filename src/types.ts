interface loginQuery {
    id: string,
    password: string,
    remember: Boolean
}

interface registerQuery {
    id: string,
    password: string,
    email: string
}

interface editQuery {
    channelName: string,
    message: string,
}

export { loginQuery, registerQuery, editQuery }