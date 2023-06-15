import { error } from "../error.js";
import { users } from "../fakeData.js";

export function returnCount(req, res) {
    try{
        const { name } = req.query;
        const userDoesNotExists = users.has(name)
        if (userDoesNotExists) {
            return res.status(404).send(error(404, "Cannot find user."))
        }
        const hasCountNumber = users.get(name).count !== undefined
        const count = hasCountNumber ? users.get(name).count : 0;
        return res.send({ count })

    } catch (e) {
        console.log(e)
        return res.status(500).send(error(500, "Server problem"))
    }

}