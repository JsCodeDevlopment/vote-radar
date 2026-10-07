# Source Map

Regra: toda informação factual relevante tem `Source` (nome, URL original, data de coleta, hash).
Separação visual no produto: **Dado oficial** · **Análise do sistema** · **Opinião do usuário** · **Notícia de terceiros**.

| Cargo | Fonte | Dados | Fase |
|---|---|---|---|
| Deputado Federal | Câmara – dadosabertos.camara.leg.br | deputados, despesas, proposições, tramitações, votações, votos | 3–5 |
| Senador | Senado – www12.senado.leg.br/dados-abertos | senadores, matérias, votações nominais | 10 |
| Deputado Estadual | Cada Assembleia (ALESP, ALESC, ALERJ…) / TSE p/ cadastro | parlamentares, proposições, votações (varia por estado) | 10 |
| Presidente | TSE (candidatura, bens, propostas de governo) + Planalto/Diário Oficial (atos) | propostas de governo, bens, atos | 9 |
| Todos (eleitoral) | TSE – dadosabertos.tse.jus.br | candidatos, bens, propostas, redes sociais, contas | 9 |
| Notícias | RSS/APIs de veículos | título, resumo, link, fonte, data (sem copiar conteúdo) | 8 |

## Arquitetura de adaptadores
`Fonte externa → Adapter (camara/senado/tse/assembleias/news) → modelo normalizado → UPSERT por (origin, externalId)`.
Cada Assembleia Estadual ganha seu próprio adapter, sem mexer no domínio (`LegislativeBody` + `Office`).

## Cargos suportados no modelo
`PRESIDENTE`, `SENADOR`, `DEPUTADO_FEDERAL`, `DEPUTADO_ESTADUAL` (`Office`), ligados a `LegislativeBody` (Câmara, Senado, Assembleia por UF, Executivo Federal).
