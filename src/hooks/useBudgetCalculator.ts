import {Depense, ResultatsBudget} from '../types/budget';

export const useBudgetCalculator = () => {
    const calculerBudget = (
        salaire: string,
        complement: string,
        depenses: Depense[],
        tauxEpargne: number
    ): ResultatsBudget => {
        const salaireNum = parseFloat(salaire) || 0;
        const complementNum = parseFloat(complement) || 0;
        const revenusTotal = salaireNum + complementNum;

        const depensesParCategorie: Record<string, any> = {};
        const depensesParCompte: Record<string, any> = {};

        depenses.forEach(d => {
            if (!d.montant || parseFloat(d.montant) === 0) return;

            const montant = parseFloat(d.montant) || 0;
            const categorie = d.categorie || 'Non catégorisé';
            const compte = d.compte || 'Compte principal';

            if (!depensesParCategorie[categorie]) {
                depensesParCategorie[categorie] = {
                    total: 0,
                    fixe: 0,
                    variable: 0,
                    couleur: d.couleur
                };
            }
            depensesParCategorie[categorie].total += montant;
            if (d.fixe) {
                depensesParCategorie[categorie].fixe += montant;
            } else {
                depensesParCategorie[categorie].variable += montant;
            }

            if (!depensesParCompte[compte]) {
                depensesParCompte[compte] = {
                    total: 0,
                    fixe: 0,
                    variable: 0
                };
            }
            depensesParCompte[compte].total += montant;
            if (d.fixe) {
                depensesParCompte[compte].fixe += montant;
            } else {
                depensesParCompte[compte].variable += montant;
            }
        });

        const depensesFixesTotal = depenses
            .filter(d => d.fixe && d.montant)
            .reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);

        const depensesVariablesTotal = depenses
            .filter(d => !d.fixe && d.montant)
            .reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);

        const depensesTotal = depensesFixesTotal + depensesVariablesTotal;
        const epargneRecommandee = revenusTotal * (tauxEpargne / 100);
        const soldeRestant = revenusTotal - depensesTotal - epargneRecommandee;
        const estNegatif = soldeRestant < 0;

        const donneesPie = Object.entries(depensesParCategorie).map(([categorie, data]) => ({
            name: categorie,
            value: data.total,
            couleur: data.couleur
        }));

        return {
            revenusTotal,
            depensesFixesTotal,
            depensesVariablesTotal,
            depensesTotal,
            epargneRecommandee,
            soldeRestant,
            estNegatif,
            donneesPie,
            depensesParCategorie,
            depensesParCompte,
            pourcentageUtilise: (depensesTotal / revenusTotal) * 100
        };
    };

    return {calculerBudget};
}; 