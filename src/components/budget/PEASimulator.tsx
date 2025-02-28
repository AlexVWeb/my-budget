import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface SimulationResult {
    annee: number;
    montant: number;
    interets: number;
    versements: number;
}

export const PEASimulator = () => {
    const [montantInitial, setMontantInitial] = useState<number>(1000);
    const [versementMensuel, setVersementMensuel] = useState<number>(100);
    const [tauxRendement, setTauxRendement] = useState<number>(7);
    const [duree, setDuree] = useState<number>(10);

    const calculerSimulation = (): SimulationResult[] => {
        const resultats: SimulationResult[] = [];
        let montantCumule = montantInitial;
        let versementsCumules = montantInitial;

        for (let annee = 1; annee <= duree; annee++) {
            const versementsAnnuels = versementMensuel * 12;
            montantCumule = (montantCumule + versementsAnnuels) * (1 + tauxRendement / 100);
            versementsCumules += versementsAnnuels;

            resultats.push({
                annee,
                montant: Math.round(montantCumule),
                interets: Math.round(montantCumule - versementsCumules),
                versements: Math.round(versementsCumules),
            });
        }

        return resultats;
    };

    const resultats = calculerSimulation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Simulateur PEA</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="montantInitial">Montant initial (€)</Label>
                            <Input
                                id="montantInitial"
                                type="number"
                                value={montantInitial}
                                onChange={(e) => setMontantInitial(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="versementMensuel">Versement mensuel (€)</Label>
                            <Input
                                id="versementMensuel"
                                type="number"
                                value={versementMensuel}
                                onChange={(e) => setVersementMensuel(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tauxRendement">Taux de rendement annuel (%)</Label>
                            <Input
                                id="tauxRendement"
                                type="number"
                                value={tauxRendement}
                                onChange={(e) => setTauxRendement(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duree">Durée (années)</Label>
                            <Input
                                id="duree"
                                type="number"
                                value={duree}
                                onChange={(e) => setDuree(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={resultats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="annee" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => `${value.toLocaleString()} €`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="montant"
                                    name="Montant total"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="interets"
                                    name="Intérêts cumulés"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="versements"
                                    name="Versements cumulés"
                                    stroke="#ffc658"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Capital final</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {resultats[resultats.length - 1].montant.toLocaleString()} €
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total versé</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {resultats[resultats.length - 1].versements.toLocaleString()} €
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Intérêts générés</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {resultats[resultats.length - 1].interets.toLocaleString()} €
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 