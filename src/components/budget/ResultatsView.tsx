import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Progress} from '@/components/ui/progress';
import {Badge, Badge as BadgeSelect} from '@/components/ui/badge';
import {ArrowDownCircle, X} from 'lucide-react';
import {Depense, ResultatsBudget} from '@/types/budget.ts';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {useState} from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResultatsViewProps {
    resultats: ResultatsBudget;
    depenses: Depense[];
}

export const ResultatsView = ({resultats, depenses}: ResultatsViewProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categories = [...new Set(depenses.map(d => d.categorie))];

    const filteredDepenses = depenses.filter(d =>
        selectedCategories.length === 0 || selectedCategories.includes(d.categorie)
    );

    const totalFiltered = filteredDepenses
        .reduce((sum, d) => sum + (d.montant ? parseFloat(d.montant) : 0), 0);

    return (
        <div className="space-y-6">
            {/* Vue d'ensemble */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Revenus totaux</p>
                            <p className="text-2xl font-bold text-green-600">{resultats.revenusTotal.toFixed(2)} €</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Dépenses totales</p>
                            <p className="text-2xl font-bold text-red-600">{resultats.depensesTotal.toFixed(2)} €</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Épargne recommandée</p>
                            <p className="text-2xl font-bold text-purple-600">{resultats.epargneRecommandee.toFixed(2)} €</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Solde restant</p>
                            <p className={`text-2xl font-bold ${resultats.estNegatif ? 'text-red-600' : 'text-blue-600'}`}>
                                {resultats.soldeRestant.toFixed(2)} €
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500">Budget utilisé</span>
                            <span className="text-sm font-semibold">
                                {Math.min(100, Number(resultats.pourcentageUtilise.toFixed(0)))}%
                            </span>
                        </div>
                        <Progress
                            value={Math.min(100, resultats.pourcentageUtilise)}
                            className={resultats.pourcentageUtilise > 100 ? 'bg-red-200' : 'bg-gray-200'}
                        />
                    </div>

                    {resultats.estNegatif && (
                        <Alert className="mt-6 border-red-200 bg-red-50">
                            <AlertTitle className="text-red-800 flex items-center gap-2">
                                <ArrowDownCircle className="h-4 w-4"/> Attention
                            </AlertTitle>
                            <AlertDescription className="text-red-700">
                                Votre budget est déficitaire de {Math.abs(resultats.soldeRestant).toFixed(2)} €.
                                Envisagez de réduire certaines dépenses ou d'ajuster votre objectif d'épargne.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Analyse par catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Répartition des dépenses</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={resultats.donneesPie}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {resultats.donneesPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.couleur}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Détails des dépenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Select
                                    onValueChange={(value) => {
                                        if (!selectedCategories.includes(value)) {
                                            setSelectedCategories([...selectedCategories, value]);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner des catégories"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Catégories</SelectLabel>
                                            {categories
                                                .filter(cat => !selectedCategories.includes(cat))
                                                .map((categorie) => (
                                                    <SelectItem key={categorie} value={categorie}>
                                                        {categorie}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedCategories.map((categorie) => (
                                        <BadgeSelect
                                            key={categorie}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {categorie}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => setSelectedCategories(prev => prev.filter(c => c !== categorie))}
                                            />
                                        </BadgeSelect>
                                    ))}
                                    {selectedCategories.length > 0 && (
                                        <BadgeSelect
                                            variant="destructive"
                                            className="cursor-pointer"
                                            onClick={() => setSelectedCategories([])}
                                        >
                                            Tout effacer
                                        </BadgeSelect>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="font-semibold">Catégorie</span>
                                <span className="font-semibold">Montant</span>
                            </div>

                            {filteredDepenses
                                .filter(d => d.montant && parseFloat(d.montant) > 0)
                                .sort((a, b) => parseFloat(b.montant) - parseFloat(a.montant))
                                .map((depense) => (
                                    <div key={depense.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{backgroundColor: depense.couleur}}
                                            />
                                            <span>{depense.categorie}</span>
                                            {depense.fixe && (
                                                <Badge variant="outline" className="text-xs">Fixe</Badge>
                                            )}
                                        </div>
                                        <span className="font-medium">{parseFloat(depense.montant).toFixed(2)} €</span>
                                    </div>
                                ))
                            }

                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">{totalFiltered.toFixed(2)} €</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analyse par compte */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analyse par compte</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Graphique des dépenses par compte */}
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(resultats.depensesParCompte).map(([compte, data]) => ({
                                            name: compte,
                                            value: data.total,
                                            couleur: '#' + Math.floor(Math.random() * 16777215).toString(16) // Couleur aléatoire
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {Object.entries(resultats.depensesParCompte).map((_, index) => (
                                            <Cell key={`cell-${index}`}
                                                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Détails des dépenses par compte */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="font-semibold">Compte</span>
                                <div className="flex gap-4">
                                    <span className="font-semibold">Fixe</span>
                                    <span className="font-semibold">Variable</span>
                                    <span className="font-semibold">Total</span>
                                </div>
                            </div>

                            {Object.entries(resultats.depensesParCompte)
                                .sort(([, a], [, b]) => b.total - a.total)
                                .map(([compte, data], index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span>{compte}</span>
                                        <div className="flex gap-4">
                                            <span className="w-20 text-right font-medium text-blue-600">
                                                {data.fixe.toFixed(2)} €
                                            </span>
                                            <span className="w-20 text-right font-medium text-purple-600">
                                                {data.variable.toFixed(2)} €
                                            </span>
                                            <span className="w-20 text-right font-medium">
                                                {data.total.toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 