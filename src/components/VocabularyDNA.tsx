import { VocabularyCategory } from '../types/vocabulary';

type Props = {
  dna: Record<VocabularyCategory, number>;
  compact?: boolean;
};

const categories: VocabularyCategory[] = ['Professional', 'Academic', 'Everyday', 'Expressive'];

export function VocabularyDNA({ dna, compact = false }: Props) {
  return (
    <div className={compact ? 'dna compact' : 'dna'}>
      {categories.map((category) => (
        <div className="dna-row" key={category}>
          <div className="dna-label">
            <span>{category}</span>
            <strong>{getLevel(dna[category])}</strong>
          </div>
          <div className="meter">
            <span style={{ width: `${dna[category]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function getLevel(score: number) {
  if (score < 45) return 'Priority area';
  if (score < 70) return 'Developing';
  return 'Strong';
}
