import { Card, CardContent } from '@/components/ui/card';
import { AddCardButton } from './add-card-button';

interface EmptyDeckStateProps {
  deckId: number;
}

export function EmptyDeckState({ deckId }: EmptyDeckStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground mb-4">
          No cards in this deck yet.
        </p>
        <AddCardButton deckId={deckId} />
      </CardContent>
    </Card>
  );
}

