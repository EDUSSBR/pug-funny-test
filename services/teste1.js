import { error } from "../error.js";
import { users } from "../fakeData.js";

const getUser = (req, res) => {
    try {
        const { name } = req.query;
        const foundUser = users.get(name)
        if (foundUser) {
            const count = foundUser.count > 0 ? ++foundUser.count : 1
            const newUserData = { ...foundUser, count }
            users.set(name, newUserData)
            return res.render('user', foundUser)
        }
        return res.status(404).send(error(404, "Cannot find user."))
    } catch (e) {
        console.log(e)
        res.send(500)
    }
};

const getUsers = (req, res) => {
    try {
        res.render('users', { users: [...users.values()] });
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
};

export {
    getUser,
    getUsers
};