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

interface userObj {
    id: string,
    password: string,
    email: string,
    sessionHash: string,
    channelId: string,
}

export { loginQuery, registerQuery, editQuery, userObj }