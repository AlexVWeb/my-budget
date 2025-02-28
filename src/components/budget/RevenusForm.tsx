import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ArrowUpCircle, Euro} from 'lucide-react';

interface RevenusFormProps {
    salaire: string;
    complement: string;
    onSalaireChange: (value: string) => void;
    onComplementChange: (value: string) => void;
}

export const RevenusForm = ({
                                salaire,
                                complement,
                                onSalaireChange,
                                onComplementChange
                            }: RevenusFormProps) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowUpCircle className="h-5 w-5 text-green-500"/>
                    Revenus Mensuels
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="salaire">Salaire</Label>
                    <div className="relative">
                        <Euro className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"/>
                        <Input
                            id="salaire"
                            type="number"
                            className="pl-10"
                            value={salaire}
                            onChange={(e) => onSalaireChange(e.target.value)}
                            placeholder="Votre salaire mensuel"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="complement">Compléments</Label>
                    <div className="relative">
                        <Euro className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"/>
                        <Input
                            id="complement"
                            type="number"
                            className="pl-10"
                            value={complement}
                            onChange={(e) => onComplementChange(e.target.value)}
                            placeholder="Primes, autres revenus"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 