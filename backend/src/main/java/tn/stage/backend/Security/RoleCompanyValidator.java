package tn.stage.backend.Security;

import tn.stage.backend.Classes.CompanyType;
import tn.stage.backend.Classes.Role;

import java.util.List;
import java.util.Map;

public class RoleCompanyValidator {

    private static final Map<CompanyType, List<Role>> ALLOWED_ROLES = Map.of(
            CompanyType.INFRASTRUCTURE_PROVIDER, List.of(Role.INFRASTRUCTURE, Role.ADMIN),
            CompanyType.RECRUITMENT_AGENCY, List.of(Role.HR, Role.FINANCE, Role.ADMIN, Role.EMPLOYEE),
            CompanyType.CLIENT, List.of(Role.CLIENT)
    );

    public static boolean isAllowed(CompanyType companyType, Role role) {
        return ALLOWED_ROLES.getOrDefault(companyType, List.of()).contains(role);
    }

    public static List<Role> allowedRolesFor(CompanyType companyType) {
        return ALLOWED_ROLES.getOrDefault(companyType, List.of());
    }
}