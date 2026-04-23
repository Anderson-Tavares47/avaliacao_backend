# Golden Raspberry Awards API

API para consultar os produtores com maior e menor intervalo entre vitórias consecutivas na categoria Pior Filme do Golden Raspberry Awards.

## Pré-requisitos

- Node.js >= 18
- npm >= 9

## Como rodar

```bash
cd golden-raspberry-api
npm install
npm run dev
```

A API sobe em `http://localhost:3000`. O `Movielist.csv` está incluído na pasta `data/` do próprio projeto.

O banco é SQLite em memória — não precisa instalar nada externo, tudo sobe junto com a aplicação.

Para gerar o build de produção:

```bash
npm run build
npm start
```

## Endpoint

### `GET /api/producers/awards-interval`

Retorna quem ganhou duas vezes com o **menor** intervalo entre os prêmios e quem esperou **mais tempo** entre duas vitórias.

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## Testes

```bash
npm test
```

Os testes são de integração e cobrem:

- Retorno com status 200
- Formato correto da resposta
- Tipos dos campos (`producer` string, `interval`/`previousWin`/`followingWin` números)
- Consistência dos dados: `previousWin + interval === followingWin`
- Resultados corretos com o CSV fornecido
- Comportamento com banco vazio

## Estrutura

```
golden-raspberry-api/
├── data/
│   └── Movielist.csv     → base de dados dos filmes (incluída no projeto)
├── src/
│   ├── server.ts         → inicializa o banco e sobe o servidor
│   ├── app.ts            → configura o Express
│   ├── db/
│   │   └── database.ts   → SQLite em memória (sql.js)
│   ├── utils/
│   │   └── csvLoader.ts  → lê o CSV e insere os dados no banco
│   ├── services/
│   │   └── awardsService.ts → calcula os intervalos entre prêmios
│   ├── models/
│   │   └── types.ts      → tipos compartilhados
│   └── routes/
│       └── producers.ts  → GET /api/producers/awards-interval
├── tests/
│   └── awards.test.ts
├── jest.config.json
├── package.json
└── tsconfig.json
```

## Stack

- **Node.js + TypeScript**
- **Express** — nível 2 de maturidade de Richardson
- **sql.js** — SQLite em memória, sem dependências nativas
- **Jest + Supertest** — testes de integração
