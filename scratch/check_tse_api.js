async function main() {
  // Let's test prestador endpoints:
  // In TSE:
  // Candidate: Antonio Denarium:
  // id: 230001604255, numero: 11, cargo: 3, uf: RR, eleicao: 2040602022, ano: 2022
  const candidate = await fetch('https://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2022/RR/2040602022/candidato/230001604255').then(r=>r.json());
  
  // Let's test combinations with query params or different path order
  const tests = [
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/concentracao/2040602022/2022/RR/3/11/230001604255/11',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/concentracao/2040602022/2022/RR/3/11/230001604255/3',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/concentracao/2040602022/2022/RR/11/3/230001604255',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/despesas/2040602022/2022/RR/3/11/230001604255/1',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/despesas/2040602022/2022/RR/3/11/230001604255?cargo=3',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/despesas/candidato/2040602022/2022/RR/3/11/230001604255',
    'https://divulgacandcontas.tse.jus.br/divulga/rest/v1/prestador/consulta/despesas/2040602022/230001604255',
  ];

  for (const url of tests) {
    try {
      const res = await fetch(url);
      console.log(url, res.status);
      if (res.ok) {
        console.log('SUCCESS:', await res.text());
        return;
      }
    } catch (e) {
      console.log(url, 'ERR:', e.message);
    }
  }
}
main();
