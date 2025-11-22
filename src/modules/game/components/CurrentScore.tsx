import { Card, CardContent } from '@/components/ui/card';

interface CurrentScoreProps {
    score: number;
}

export const CurrentScore = ({ score }: CurrentScoreProps) => {
    return (
        <Card className="bg-muted/50 border-0">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Current Score</p>
                        <p className="text-4xl font-bold">{score}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
