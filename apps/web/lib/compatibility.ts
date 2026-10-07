// Regra de compatibilidade (transparente e reproduzivel).
// Deve espelhar o futuro CompatibilityService do backend.
//
// Para cada voto do parlamentar em uma proposicao ligada a uma politica
// sobre a qual o usuario tem posicao (CONCORDA/DISCORDA):
//   - voto SIM em proposicao que FAVORECE a politica  => parlamentar a favor da politica
//   - voto NAO em proposicao que FAVORECE a politica  => parlamentar contra a politica
//   - (invertido quando a proposicao CONTRARIA a politica)
//   - abstencao, obstrucao, ausencia ou votacao nao nominal => NAO AVALIAVEL
// Compatibilidade = compativeis / (compativeis + contrarias).

import type {
  Compatibility,
  CompatibilityItem,
  CompatibilityResult,
  PoliticianVote,
  UserPositions,
} from './types';
import { POSITION_LABEL, VOTE_CHOICE_LABEL } from './labels';

export function evaluateVote(
  vote: PoliticianVote,
  positions: UserPositions,
): CompatibilityItem[] {
  const items: CompatibilityItem[] = [];
  for (const link of vote.policies) {
    const userPosition = positions[link.policyId];
    if (!userPosition || userPosition === 'NEUTRAL') continue;

    let result: CompatibilityResult;
    let reason: string;
    const proposalEffect = link.supportsPolicy ? 'favorece' : 'contraria';

    if (!vote.voting.nominal) {
      result = 'NOT_EVALUABLE';
      reason = 'Votação não nominal: não há registro individual do voto.';
    } else if (vote.choice !== 'YES' && vote.choice !== 'NO') {
      result = 'NOT_EVALUABLE';
      reason = `Registro "${VOTE_CHOICE_LABEL[vote.choice]}" não indica posição sobre o mérito.`;
    } else {
      const politicianFavors = (vote.choice === 'YES') === link.supportsPolicy;
      const userFavors = userPosition === 'AGREE';
      result = politicianFavors === userFavors ? 'COMPATIBLE' : 'INCOMPATIBLE';
      reason =
        `A proposição ${proposalEffect} a política "${link.policyName}" (segundo nossa classificação). ` +
        `O voto ${VOTE_CHOICE_LABEL[vote.choice]} foi, portanto, ${politicianFavors ? 'a favor' : 'contra'} a política. ` +
        `Você ${POSITION_LABEL[userPosition].toLowerCase()} dela.`;
    }

    items.push({
      votingId: vote.voting.id,
      votedAt: vote.voting.votedAt,
      proposal: vote.proposal,
      policyId: link.policyId,
      policyName: link.policyName,
      topicName: link.topicName,
      userPosition,
      choice: vote.choice,
      supportsPolicy: link.supportsPolicy,
      result,
      reason,
      classifiedBy: link.classifiedBy,
      confidence: link.confidence,
      rationale: link.rationale,
      source: vote.source,
    });
  }
  return items;
}

export function computeCompatibility(
  politicianId: string,
  votes: PoliticianVote[],
  positions: UserPositions,
): Compatibility {
  const items = votes.flatMap((v) => evaluateVote(v, positions));
  const compatible = items.filter((i) => i.result === 'COMPATIBLE').length;
  const incompatible = items.filter((i) => i.result === 'INCOMPATIBLE').length;
  const notEvaluable = items.filter((i) => i.result === 'NOT_EVALUABLE').length;
  const evaluable = compatible + incompatible;
  return {
    politicianId,
    compatible,
    incompatible,
    notEvaluable,
    score: evaluable > 0 ? compatible / evaluable : null,
    items: items.sort((a, b) => b.votedAt.localeCompare(a.votedAt)),
  };
}
