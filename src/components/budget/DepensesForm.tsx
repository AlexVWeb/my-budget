import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {ArrowDownCircle, Euro, Plus, Trash2} from 'lucide-react';
import {Depense} from '@/types/budget.ts';

interface DepensesFormProps {
    depenses: Depense[];
    categories: string[];
    comptes: string[];
    typesDepense: string[];
    onAddDepense: () => void;
    onUpdateDepense: (id: number, field: string, value: string | boolean) => void;
    onDeleteDepense: (id: number) => void;
    onCalculerBudget: () => void;
}

export const DepensesForm = ({
                                 depenses,
                                 categories,
                                 comptes,
                                 typesDepense,
                                 onAddDepense,
                                 onUpdateDepense,
                                 onDeleteDepense,
                                 onCalculerBudget
                             }: DepensesFormProps) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ArrowDownCircle className="h-5 w-5 text-red-500"/>
                        Dépenses Mensuelles
                    </CardTitle>
                    <Button onClick={onAddDepense} size="sm" variant="outline" className="flex items-center gap-1">
                        <Plus className="h-4 w-4"/> Ajouter
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {depenses.map((depense) => (
                        <div key={depense.id}
                             className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                            <div className="col-span-3 md:col-span-2">
                                <Input
                                    type="text"
                                    value={depense.nom || ''}
                                    onChange={(e) => onUpdateDepense(depense.id, 'nom', e.target.value)}
                                    placeholder="Nom"
                                />
                            </div>
                            <div className="col-span-3 md:col-span-2">
                                <select
                                    className="w-full p-2 border rounded"
                                    value={depense.categorie || ''}
                                    onChange={(e) => onUpdateDepense(depense.id, 'categorie', e.target.value)}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-3 md:col-span-2">
                                <div className="relative">
                                    <Euro className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"/>
                                    <Input
                                        type="number"
                                        className="pl-10"
                                        value={depense.montant || ''}
                                        onChange={(e) => onUpdateDepense(depense.id, 'montant', e.target.value)}
                                        placeholder="Montant"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-2">
                                <select
                                    className="w-full p-2 border rounded"
                                    value={depense.compte || ''}
                                    onChange={(e) => onUpdateDepense(depense.id, 'compte', e.target.value)}
                                >
                                    <option value="">Sélectionner un compte</option>
                                    {comptes.map((cpt, index) => (
                                        <option key={index} value={cpt}>{cpt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <select
                                    className="w-full p-2 border rounded"
                                    value={depense.type || 'Récurrent'}
                                    onChange={(e) => onUpdateDepense(depense.id, 'type', e.target.value)}
                                >
                                    {typesDepense.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-0 md:col-span-1 hidden md:flex items-center justify-center">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id={`paye-${depense.id}`}
                                        checked={depense.paye || false}
                                        onCheckedChange={(checked) => onUpdateDepense(depense.id, 'paye', checked)}
                                    />
                                    <Label htmlFor={`paye-${depense.id}`} className="hidden md:inline">Payé</Label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onDeleteDepense(depense.id)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
                <Button
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    size="lg"
                    onClick={onCalculerBudget}
                >
                    Calculer mon budget
                </Button>
            </CardFooter>
        </Card>
    );
}; 