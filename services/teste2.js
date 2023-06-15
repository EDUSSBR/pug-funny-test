import { error } from "../error.js";
import { users } from "../fakeData.js";

export function deleteUser(req, res) {
    const { name } = req.query;
    if (users.has(name)) {
        users.delete(name)
        return res.sendStatus(200)
    }
    res.status(404).send(error(404, "Cannot find user."));
}


export function createUser(req, res) {
    const { name, job } = req.body;
    const newUser = { id: users.size + 1, name, job }
    if (users.has(name)) {
        return res.status(409).send(error(409, "User already exists."))
    }
    users.set(name, newUser)
    res.send(newUser);
};