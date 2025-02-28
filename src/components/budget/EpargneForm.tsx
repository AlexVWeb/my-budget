import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Label} from '@/components/ui/label';
import {Slider} from '@/components/ui/slider';
import {PiggyBank} from 'lucide-react';

interface EpargneFormProps {
    tauxEpargne: number;
    onTauxEpargneChange: (value: number) => void;
}

export const EpargneForm = ({
                                tauxEpargne,
                                onTauxEpargneChange
                            }: EpargneFormProps) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-purple-500"/>
                    Objectif d'Épargne
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Pourcentage de vos revenus à épargner</Label>
                        <Badge variant="outline" className="font-bold">{tauxEpargne}%</Badge>
                    </div>
                    <Slider
                        value={[tauxEpargne]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={(value) => onTauxEpargneChange(value[0])}
                        className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 