interface loginQuery {
    id: string,
    password: string
}
interface registerQuery {
    id: string,
    password: string,
    email: string
}

export { loginQuery, registerQuery }