import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

const app = express();
const porta = 3030;
const host = '0.0.0.0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'umaChaveMuitoSegura123!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } 
}));

app.use(express.static(path.join(__dirname, 'publico')));

const USUARIO = 'admin';
const SENHA = '1234';

function verificarAutenticacao(req, res, next) {
  if (req.session?.autenticado) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'publico', 'p1.html'));
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === USUARIO && senha === SENHA) {
    req.session.autenticado = true;
    res.redirect('/privado/detalhes');
  } else {
    res.send(`
      <h1>Usuário ou senha incorretos!</h1>
      <a href="/login.html"><button class="btn btn-primary">Tentar novamente</button></a>
    `);
  }
});

app.get('/privado/detalhes', verificarAutenticacao, (req, res) => {
  res.sendFile(path.join(__dirname, 'publico', 'privado', 'detalhes.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Erro ao sair');
    res.redirect('/');
  });
});

app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://localhost:${host}:${porta}`);
});
