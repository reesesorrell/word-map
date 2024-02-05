import { promises as fs } from 'fs';
import next from 'next';
import HomePage from './client-home-page';

export default async function Page() {
  const file = await fs.readFile(process.cwd() + '/app/generated_words_trie.json', 'utf8');
  const data = JSON.parse(file);
  const dict = data['S']['T']['A']['R']

  return (
    <div>
      <HomePage dictData={data} />
      {<div>{Object.keys(dict)}</div>}
    </div>
  );
}