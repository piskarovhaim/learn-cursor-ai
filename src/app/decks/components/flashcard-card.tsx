import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditCardButton } from './edit-card-button';
import { DeleteCardButton } from './delete-card-button';

interface FlashcardCardProps {
  id: number;
  deckId: number;
  front: string;
  back: string;
  createdAt: Date;
}

export function FlashcardCard({ id, deckId, front, back, createdAt }: FlashcardCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Front</CardTitle>
          <div className="flex items-center gap-2">
            <EditCardButton cardId={id} front={front} back={back} />
            <DeleteCardButton cardId={id} deckId={deckId} />
          </div>
        </div>
        <Separator className="my-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base">{front}</p>
        
        <Separator />
        
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">
            Back
          </p>
          <p className="text-base">{back}</p>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground">
          Added {new Date(createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

