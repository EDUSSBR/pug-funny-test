import { error } from "../error.js";
import { users } from "../fakeData.js";

export function deleteUser(req, res) {
    try {
        const { name } = req.query;
        if (users.has(name)) {
            users.delete(name)
            return res.sendStatus(200)
        }
        res.status(404).send(error(404, "Cannot find user."));
        
    } catch (e) {
        console.log(e)
        return res.status(500).send(error(500, "Server problem"))
        
    }
}
