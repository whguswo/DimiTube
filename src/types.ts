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

export { loginQuery, registerQuery }