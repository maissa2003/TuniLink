package tn.stage.backend.Classes;

public enum Role {
    ADMIN,          // Super-admin plateforme (développeur) — accès total, company=null
    MANAGER,        // Gérant société RH : RH + Finance + Employé + gestion utilisateurs agence
    HR,             // Responsable RH : données RH + Employés uniquement — PAS Finance, PAS Admin
    FINANCE,        // Staff Finance : données financières uniquement
    INFRASTRUCTURE, // Staff Infrastructure Provider
    CLIENT,         // Client canadien
    EMPLOYEE        // Employé placé chez un client
}