import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import DepartamentoController from './app/controllers/DepartamentoController';
import TarefaController from './app/controllers/TarefaController';
import IndicadorController from './app/controllers/IndicadorController';

// Intercepatador de autenticao
import authMiddleware from './app/middlewares/auth';
import authAdminMiddleware from './app/middlewares/authAdmin';

const routes = new Router();

// Login do sistema
routes.post('/login', SessionController.store);

// Intercepta chamadas e valida autenticacao, todas as rotas abaixo precisam estar autenticadas
routes.use(authMiddleware);

// Rotas de Tarefas
routes.post('/tarefas', TarefaController.store);
routes.put('/tarefas/:id', TarefaController.update);

routes.use(authAdminMiddleware);

// Rotas abaixo somente para administradores
routes.get('/tarefas', TarefaController.index);
routes.delete('/tarefas/:id', TarefaController.delete);

// Rotas de Usuários
routes.post('/usuarios', UserController.store);
routes.put('/usuarios', UserController.update);
routes.get('/usuarios', UserController.index);
routes.delete('/usuarios/:id', UserController.delete);

// Rotas de Departamentos
routes.post('/departamentos', DepartamentoController.store);
routes.put('/departamentos/:id', DepartamentoController.update);
routes.get('/departamentos', DepartamentoController.index);
routes.delete('/departamentos/:id', DepartamentoController.delete);

// Rotas de Tarefas
routes.post('/tarefas', TarefaController.store);
routes.put('/tarefas/:id', TarefaController.update);
routes.get('/tarefas', TarefaController.index);
routes.delete('/tarefas/:id', TarefaController.delete);

// Rotas de Indicadores
routes.get('/indicadores', IndicadorController.index);

export default routes;
