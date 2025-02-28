export interface Depense {
    id: number;
    nom: string;
    montant: string;
    categorie: string;
    fixe: boolean;
    couleur: string;
    type: string;
    compte: string;
    paye: boolean;
}

export interface ResultatsBudget {
    revenusTotal: number;
    depensesFixesTotal: number;
    depensesVariablesTotal: number;
    depensesTotal: number;
    epargneRecommandee: number;
    soldeRestant: number;
    estNegatif: boolean;
    donneesPie: Array<{
        name: string;
        value: number;
        couleur: string;
    }>;
    depensesParCategorie: Record<string, {
        total: number;
        fixe: number;
        variable: number;
        couleur: string;
    }>;
    depensesParCompte: Record<string, {
        total: number;
        fixe: number;
        variable: number;
    }>;
    pourcentageUtilise: number;
} 