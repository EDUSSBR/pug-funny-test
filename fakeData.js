const fakeData = [
    {
        id: 1,
        name: "João Oliveira",
        job: "Desenvolvedor"
    }
]

const users = new Map()
for (let user of fakeData) {
    users.set(user.name, user)
}
export { users }
