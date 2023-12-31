import { error } from "../error.js";
import { users } from "../fakeData.js";

export function updateUser(req, res) {
    try{
        const { id } = req.query;
        const { name, job } = req.body;
        const nameAlreadyExists = users.has(name)
        if (nameAlreadyExists) {
            return res.status(409).send(error(409, "User already exists, try another name"))
        }
        for (const user of users.values()) {
            const isTheUserForUpdating = Number(user.id) == Number(id)
            if (isTheUserForUpdating) {
                users.delete(user.name)
                users.set(name, { id, name, job })
                return res.sendStatus(200)
            }
        }
        res.status(404).send(error(404, "Cannot find user."))
    } catch(e){
        console.log(e)
        return res.status(500).send(error(500, "Server problem"))
    }
    
}
