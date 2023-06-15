import { error } from "../error.js";
import { users } from "../fakeData.js";

export function returnCount(req, res) {
    const { name } = req.query;
    if (!users.has(name)) {
        return res.status(404).send(error(404, "Cannot find user."))
    }
    
    const hasCount = users.get(name).count !== undefined
    const count = hasCount ? users.get(name).count : 0;
    return res.send({ count })
}