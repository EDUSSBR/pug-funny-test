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
