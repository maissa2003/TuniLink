package tn.stage.backend.Classes;

public enum Role {
    ADMIN,
    HR,             // staff de la Recruitment Agency : gère coûts employé + marge HR
    FINANCE,        // staff Finance, calcule la paie, les marges, les projections
    INFRASTRUCTURE, // staff de l'Infrastructure Provider : gère coûts bureau/internet/équipement
    CLIENT,         // utilisateur côté client canadien
    EMPLOYEE
}