import {useRef, useState} from 'react';
import Papa from 'papaparse';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {Wallet} from 'lucide-react';
import {RevenusForm} from './components/budget/RevenusForm';
import {EpargneForm} from './components/budget/EpargneForm';
import {DepensesForm} from './components/budget/DepensesForm';
import {ResultatsView} from './components/budget/ResultatsView';
import {useLocalStorage} from './hooks/useLocalStorage';
import {useBudgetCalculator} from './hooks/useBudgetCalculator';
import {Depense} from './types/budget';
import {COLORS, DEFAULT_DEPENSES} from './constants/colors';
import { ThemeToggle } from './components/ThemeToggle';

const App = () => {
    const {chargerDonnees, sauvegarderDonnees} = useLocalStorage();
    const {calculerBudget} = useBudgetCalculator();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialisation des états avec les données du localStorage ou valeurs par défaut
    const donneesSauvegardees = chargerDonnees();

    const [salaire, setSalaire] = useState(donneesSauvegardees?.salaire || '');
    const [complement, setComplement] = useState(donneesSauvegardees?.complement || '');
    const [depenses, setDepenses] = useState<Depense[]>(donneesSauvegardees?.depenses || DEFAULT_DEPENSES);
    const [tauxEpargne, setTauxEpargne] = useState(donneesSauvegardees?.tauxEpargne || 20);
    const [resultats, setResultats] = useState(donneesSauvegardees?.resultats || null);
    const [showResults, setShowResults] = useState(donneesSauvegardees?.showResults || false);
    const [activeTab, setActiveTab] = useState(showResults ? 'resultats' : 'saisie');

    // État pour les notifications
    const [notification, setNotification] = useState<string | null>(null);

    // État pour les catégories et comptes
    const [categories, setCategories] = useState<string[]>([]);
    const [comptes, setComptes] = useState<string[]>([]);
    const [typesDepense, setTypesDepense] = useState(['Récurrent', 'Temporaire']);

    // Charger un fichier CSV
    const importerCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Réinitialiser l'input file pour permettre de recharger le même fichier
        event.target.value = '';

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target?.result;
            if (!csvData) return;

            Papa.parse(csvData.toString(), {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const data = results.data as Array<Record<string, string>>;
                        // Extraire les catégories et comptes uniques
                        const categoriesUniques = [...new Set(data.map(item => item.Catégorie))].filter(Boolean);
                        const comptesUniques = [...new Set(data.map(item => item.Compte))].filter(Boolean);
                        const typesUniques = [...new Set(data.map(item => item.Type))].filter(Boolean);

                        setCategories(categoriesUniques);
                        setComptes(comptesUniques);
                        if (typesUniques.length > 0) {
                            setTypesDepense(typesUniques);
                        }

                        // Convertir les données CSV en format de dépenses
                        const nouvellesDepenses = data.map((ligne, index) => {
                            // Nettoyer et convertir le montant
                            let montantStr = ligne.Montant || '0';
                            montantStr = montantStr.replace('€', '').replace(',', '.').trim();
                            const montant = parseFloat(montantStr) || 0;

                            // Déterminer si la dépense est fixe (récurrente)
                            const estFixe = ligne.Type === 'Récurrent';

                            // Générer une couleur basée sur la catégorie
                            const categorieIndex = categoriesUniques.indexOf(ligne.Catégorie);
                            const couleur = COLORS[categorieIndex % COLORS.length];

                            return {
                                id: index + 1,
                                nom: ligne.Name || '',
                                montant: montant.toString(),
                                categorie: ligne.Catégorie || '',
                                fixe: estFixe,
                                couleur: couleur,
                                type: ligne.Type || '',
                                compte: ligne.Compte || '',
                                paye: ligne.Payé === 'Yes'
                            };
                        });

                        setDepenses(nouvellesDepenses);
                        setNotification('importation');
                        setTimeout(() => setNotification(null), 2000);
                    } catch (error) {
                        console.error("Erreur lors du traitement du CSV:", error);
                        setNotification('erreur-import');
                        setTimeout(() => setNotification(null), 3000);
                    }
                },
                error: (error: Error) => {
                    console.error("Erreur lors de l'analyse du CSV:", error);
                    setNotification('erreur-import');
                    setTimeout(() => setNotification(null), 3000);
                }
            });
        };

        reader.readAsText(file);
    };

    // Ajouter une nouvelle dépense
    const ajouterDepense = () => {
        const nouvelId = depenses.length > 0 ? Math.max(...depenses.map(d => d.id)) + 1 : 1;
        const nouvelleIndex = depenses.length % COLORS.length;

        const nouvelleDépense: Depense = {
            id: nouvelId,
            nom: '',
            montant: '',
            categorie: categories.length > 0 ? categories[0] : '',
            type: typesDepense[0],
            fixe: true,
            couleur: COLORS[nouvelleIndex],
            compte: comptes.length > 0 ? comptes[0] : '',
            paye: false
        };

        setDepenses([...depenses, nouvelleDépense]);
    };

    // Réinitialiser toutes les données
    const reinitialiserDonnees = () => {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes vos données ?")) {
            setSalaire('');
            setComplement('');
            setDepenses(DEFAULT_DEPENSES);
            setTauxEpargne(20);
            setResultats(null);
            setShowResults(false);
            setActiveTab('saisie');
            localStorage.removeItem('smartBudgetData');
            setNotification('reinitialisation');
            setTimeout(() => setNotification(null), 2000);
        }
    };

    // Mettre à jour une dépense
    const updateDepense = (id: number, field: string, value: string | boolean) => {
        setDepenses(depenses.map(depense => {
            if (depense.id === id) {
                if (field === 'type') {
                    return {
                        ...depense,
                        type: value as string,
                        fixe: value === 'Récurrent'
                    };
                }
                return {...depense, [field]: value};
            }
            return depense;
        }));
    };

    // Supprimer une dépense
    const supprimerDepense = (id: number) => {
        setDepenses(depenses.filter(depense => depense.id !== id));
    };

    // Calculer le budget
    const handleCalculerBudget = () => {
        const resultatsCalcules = calculerBudget(salaire, complement, depenses, tauxEpargne);
        setResultats(resultatsCalcules);
        setShowResults(true);
        setActiveTab('resultats');

        // Sauvegarder les données
        sauvegarderDonnees({
            salaire,
            complement,
            depenses,
            tauxEpargne,
            resultats: resultatsCalcules,
            showResults: true
        });
    };

    return (
        <div className="p-4 max-w-6xl mx-auto min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <ThemeToggle />
            <Card className="shadow-lg border-t-4 border-t-blue-500 dark:bg-gray-800 dark:border-blue-400">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">Smart Budget</CardTitle>
                            <CardDescription className="text-blue-600 dark:text-blue-400">Gestion intelligente de vos finances personnelles</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            {notification && (
                                <span className={`text-sm font-medium animate-pulse ${
                                    notification.includes('erreur') ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    {notification === 'importation' && 'CSV importé avec succès ✓'}
                                    {notification === 'erreur-import' && 'Erreur d\'importation ✗'}
                                    {notification === 'reinitialisation' && 'Données réinitialisées ✓'}
                                </span>
                            )}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Importer CSV
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={importerCSV}
                                    accept=".csv"
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm"
                                    onClick={reinitialiserDonnees}
                                >
                                    Réinitialiser
                                </Button>
                            </div>
                            <Wallet className="h-10 w-10 text-blue-500"/>
                        </div>
                    </div>
                </CardHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="saisie">Saisie</TabsTrigger>
                            <TabsTrigger value="resultats" disabled={!showResults}>
                                Résultats
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="saisie" className="p-4 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RevenusForm
                                salaire={salaire}
                                complement={complement}
                                onSalaireChange={setSalaire}
                                onComplementChange={setComplement}
                            />
                            <EpargneForm
                                tauxEpargne={tauxEpargne}
                                onTauxEpargneChange={setTauxEpargne}
                            />
                        </div>

                        <div className="mt-6">
                            <DepensesForm
                                depenses={depenses}
                                categories={categories}
                                comptes={comptes}
                                typesDepense={typesDepense}
                                onAddDepense={ajouterDepense}
                                onUpdateDepense={updateDepense}
                                onDeleteDepense={supprimerDepense}
                                onCalculerBudget={handleCalculerBudget}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="resultats" className="p-4 pt-6">
                        {resultats && <ResultatsView resultats={resultats} depenses={depenses}/>}
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default App;