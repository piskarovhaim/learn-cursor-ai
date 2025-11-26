import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeckHeaderProps {
  name: string;
  description: string | null;
  cardCount: number;
  createdAt: Date;
}

export function DeckHeader({ name, description, cardCount, createdAt }: DeckHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl">{name}</CardTitle>
            {description && (
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="secondary">
                {cardCount} {cardCount === 1 ? 'card' : 'cards'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

