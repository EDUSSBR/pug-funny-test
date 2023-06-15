import { error } from "../error.js";
import { users } from "../fakeData.js";
import crypto from 'crypto';
export function givePermission(req, res) {
    try {
        const { name, password, canUpdate = true, canDelete = true } = req.body;
        const { authorization } = req.headers
        //token do adm do servidor pra permitir que ele adicione um novo adm ao sistema
        if (authorization !== 'meutokensecreto') {
            return res.status(401).send(error(401, "Unauthorized."))
        }
        if (!name || !password) {
            return res.status(404).send(error(404, "Please send an user name and password for the user."))
        }
        if (!users.has(name)) {
            return res.status(404).send(error(404, "Cannot find user."))
        }
        const hash = crypto.createHash('sha256')
        const passwordHash = hash.update(password + "superhash0salts").digest('hex')
        const myNewAdminAccount = { ...users.get(name), permissions: { canUpdate, canDelete }, password: passwordHash };
        users.set(name, myNewAdminAccount)
        return res.send()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}
export function login(req, res) {
    try {
        const { name, password } = req.body;
        if (!users.has(name) || !users.get(name).password) {
            return res.status(404).send(error(404, "Cannot find user."))
        }
        const hashedPassword = crypto.createHash('sha256').update(password + "superhash0salts").digest('hex')
        if (hashedPassword !== users.get(name).password) {
            return res.status(400).send(error(400, "Bad Request"))
        }
        const newToken = "token-secreto-monstro-do--" + name + "--" + crypto.randomBytes(20).toString('hex')
        const accWithToken = { ...users.get(name), token: newToken };
        users.set(name, accWithToken)
        console.log('token para copiar e usar no header authorization', newToken)
        return res.send({ token: newToken })
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export function authentication(req, res, next) {
    try {
        const { authorization } = req.headers
        console.log(authorization)
        const name = authorization?.split("--")[1]
        const isNotAuthorized = !users.has(name) || !users.get(name).password || authorization !== users.get(name).token
        if (isNotAuthorized) {
            return res.status(401).send(error(401, "Unauthorized."))
        }
        req.permissions = users.get(name).permissions
        next()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export function canDelete(req, res, next) {
    try {
        const { canDelete } = req.permissions
        if (!canDelete) {
            return res.status(401).send(error(401, "Unauthorized."))
        }
        next()

    } catch (e) {
        console.log(e)
        return res.status(500).send(error(500, "Server problem"))
    }
}
export function canUpdate(req, res, next) {
    try {
        const { canUpdate } = req.permissions
        if (!canUpdate) {
            return res.status(401).send(error(401, "Unauthorized."))
        }
        next()
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}