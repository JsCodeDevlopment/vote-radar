async function main() {
  const text = await fetch('https://divulgacandcontas.tse.jus.br/divulga/main.1fb9a568ed45c8bb.js').then(r => r.text());
  const chunkRegex = /[0-9]+\.[a-f0-9]+\.js/g;
  const chunks = [...new Set(text.match(chunkRegex) || [])];
  console.log('Found chunks:', chunks.length, chunks.slice(0, 10));
}
main();
