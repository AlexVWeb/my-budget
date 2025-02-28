import { Depense } from '../types/budget';
import { DEFAULT_DEPENSES } from '../constants/colors';

interface StoredData {
    salaire: string;
    complement: string;
    depenses: Depense[];
    tauxEpargne: number;
    resultats: any;
    showResults: boolean;
}

export const useLocalStorage = () => {
    const chargerDonnees = (): StoredData | null => {
        try {
            const donneesSauvegardees = localStorage.getItem('smartBudgetData');
            if (donneesSauvegardees) {
                const donneesParsees = JSON.parse(donneesSauvegardees);
                return {
                    salaire: donneesParsees.salaire || '',
                    complement: donneesParsees.complement || '',
                    depenses: donneesParsees.depenses || DEFAULT_DEPENSES,
                    tauxEpargne: donneesParsees.tauxEpargne || 20,
                    resultats: donneesParsees.resultats || null,
                    showResults: donneesParsees.showResults || false
                };
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
        }
        return null;
    };

    const sauvegarderDonnees = (donnees: StoredData) => {
        try {
            localStorage.setItem('smartBudgetData', JSON.stringify(donnees));
            return true;
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des données:", error);
            return false;
        }
    };

    return { chargerDonnees, sauvegarderDonnees };
}; 