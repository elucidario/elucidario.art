# Mdorim

> Modelo de Dados para Organização e Representação da Informação Museológica

## Namespaces

```yaml
mdorim/
├── core
│   ├── definitions
│   ├── User
│   └── Workspace
│       └── Team
└── linked-art
```

## core

### Definitions [@link](./src/schemas/core/definitions.ts)

Usado para definir os tipos de dados utilizados no sistema.

> id: core/definitions

### User [@link](./src/schemas/core/user/User.ts)

Usado para representar o usuário do sistema.

> id: core/User

### Workspace [@link](./src/schemas/core/workspace/Workspace.ts)

Usado para representar o espaço de trabalho dos usuários.

> id: core/Workspace

#### Team [@link](./src/schemas/core/workspace/Team.ts)

Representa um grupo de usuários que trabalham juntos em um espaço de trabalho.
> id: core/Workspace/team

## linked-art
