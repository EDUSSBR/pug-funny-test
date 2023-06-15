import express from 'express';
import * as url from 'url';
import { getUser, getUsers } from './services/teste1.js';
import { createUser } from './services/teste2.js';
import { deleteUser } from './services/teste3.js';
import { updateUser } from './services/teste4.js';
import { returnCount } from './services/teste5.js';
import { authentication, canDelete, canUpdate, login, givePermission } from './services/teste6.js';
import cors from 'cors'
/* 
Daria pra acrescentar muitas coisas, o básico pedido está aí..
Algumas coisas que deixei de lado: 
-Validações
-Sanitizações
-Não me preocupei se um usuário adm pode mexer em outro
-Não me preocupei com os dados enviados ao front no caso de o servidor for uma api rest sem o jade,
teria que selecionar pra não enviar o password e outras informações quando realizado o get do usuário,
como o jade envia montada a pagina, dessa maneira achei ok deixar o objeto completo.
-Tudo implementado em memória ficou simples, praticamente não tem muito o que melhorar em performance,
o que preferi fazer foi usar um Map pra não ter que percorrer o array em busca do usuário,
retornando o usuário em O(1).
-Daria pra dar uma organizada geral colocando os middlewares, controllers, routes e tudo que fosse necessário
-O objeto que a função erro gera, deixei simples pra lançar algo pro front apenas.
*/

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views/');
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
  // `
  // get user/ </br>
  // get users/ </br>
  // post users/ </br>
  // delete users/ </br>
  // put users/ </br>
  // get /users/access </br>
  // post /givePermission </br>
  // post /login </br>
  // `
});
app.get("/user", getUser);
app.get("/users", getUsers);
app.post("/users", createUser)
app.delete("/users", authentication, canDelete, deleteUser)
app.put("/users", authentication, canUpdate, updateUser)
app.get("/users/access", returnCount);
app.post("/givePermission", givePermission)
app.post("/login", login)


app.listen(PORT, () => console.log(`Express server listening on PORT ${PORT}`));