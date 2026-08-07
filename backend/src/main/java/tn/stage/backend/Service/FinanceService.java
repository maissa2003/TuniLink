package tn.stage.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.stage.backend.Classes.*;
import tn.stage.backend.DTO.InvoiceDto;
import tn.stage.backend.DTO.PayrollRecordDto;
import tn.stage.backend.Repositories.*;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Finance Department service.
 * Reads from HR (EmployeeContract) and Infrastructure (InfrastructureCost) — NEVER modifies them.
 * Calculates payroll, validates it, and generates invoices.
 */
@Service
@RequiredArgsConstructor
public class FinanceService {

    // Tunisian statutory rates — same as SimulationCalculationService
    private static final BigDecimal EMPLOYEE_CNSS = new BigDecimal("0.0918");
    private static final BigDecimal EMPLOYER_CNSS = new BigDecimal("0.1657");
    private static final BigDecimal FLAT_IRPP_RATE = new BigDecimal("0.15");
    private static final BigDecimal DEFAULT_RECRUITMENT_MARGIN = new BigDecimal("0.10");
    private static final BigDecimal DEFAULT_INFRA_MARGIN = new BigDecimal("0.10");
    private static final BigDecimal DEFAULT_EXCHANGE_RATE = new BigDecimal("0.45");

    private static final MathContext MC = new MathContext(12, RoundingMode.HALF_UP);
    private static final int SCALE = 2;

    private final EmployeeContractRepository contractRepo;
    private final InfrastructureCostRepository infraRepo;
    private final PayrollRecordRepository payrollRepo;
    private final InvoiceRepository invoiceRepo;
    private final EmployeeRepository employeeRepo;
    private final AssignmentRepository assignmentRepo;
    private final UserRepository userRepo;
    private final ExchangeRateRepository exchangeRateRepo;
    private final MarginConfigRepository marginConfigRepo;
    private final EmployeeEventRepository eventRepo;
    private final EmailService emailService;

    /** Preview calculation — not saved */
    public PayrollRecordDto calculatePayrollPreview(Long employeeId) {
        EmployeeContract contract = getActiveContract(employeeId);
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        BigDecimal infraTotal = sumInfraCost(employeeId, currentMonth);
        return buildPayrollDto(employeeId, contract, infraTotal, currentMonth);
    }

    /** Validate payroll — saves PayrollRecord, advances status, generates invoice */
    @Transactional
    public PayrollRecordDto validatePayroll(Long employeeId, String financeUserEmail) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));
        User financeUser = userRepo.findByEmail(financeUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + financeUserEmail));
        EmployeeContract contract = getActiveContract(employeeId);
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);

        // Check if already validated this month
        if (payrollRepo.findByEmployeeIdAndPeriodMonth(employeeId, currentMonth).isPresent()) {
            throw new IllegalStateException("Payroll already validated for " + currentMonth);
        }

        BigDecimal infraTotal = sumInfraCost(employeeId, currentMonth);
        PayrollRecordDto preview = buildPayrollDto(employeeId, contract, infraTotal, currentMonth);

        // Save record
        PayrollRecord record = new PayrollRecord();
        record.setEmployee(employee);
        record.setContract(contract);
        record.setPeriodMonth(currentMonth);
        record.setGrossSalary(preview.getGrossSalary());
        record.setEmployeeCnss(preview.getEmployeeCnss());
        record.setIrppTax(preview.getIrppTax());
        record.setBonus(preview.getBonus());
        record.setNetSalary(preview.getNetSalary());
        record.setEmployerCnss(preview.getEmployerCnss());
        record.setInfraCostTotal(preview.getInfraCostTotal());
        record.setRecruitmentMargin(preview.getRecruitmentMargin());
        record.setInfraMargin(preview.getInfraMargin());
        record.setTotalEmployerCostTnd(preview.getTotalEmployerCostTnd());
        record.setFinalInvoiceCad(preview.getFinalInvoiceCad());
        record.setExchangeRateUsed(preview.getExchangeRateUsed());
        record.setStatus(PayrollStatus.VALIDATED);
        record.setValidatedBy(financeUser);
        record.setValidatedAt(LocalDateTime.now());

        PayrollRecord saved = payrollRepo.save(record);

        // Advance employee status
        if (employee.getStatus() == EmployeeStatus.INFRASTRUCTURE_ASSIGNED || employee.getStatus() == EmployeeStatus.PAYROLL_CALCULATED) {
            employee.setStatus(EmployeeStatus.FINANCE_VALIDATED);
            employeeRepo.save(employee);
        }

        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("PAYROLL_VALIDATED");
        event.setDescription("Finance validated payroll for " + currentMonth);
        event.setPerformedBy(financeUser);
        eventRepo.save(event);

        // Notify client: send email to all CLIENT users attached to the client company
        assignmentRepo.findByEmployeeId(employeeId).stream()
                .filter(a -> a.getStatus() == AssignmentStatus.ACTIVE)
                .findFirst()
                .ifPresent(assignment -> {
                    if (assignment.getClientCompany() != null) {
                        userRepo.findAll().stream()
                                .filter(u -> u.getRole() == Role.CLIENT
                                        && u.getCompany() != null
                                        && u.getCompany().getId().equals(assignment.getClientCompany().getId()))
                                .forEach(clientUser -> emailService.sendClientFinancialProposalEmail(
                                        clientUser.getEmail(),
                                        clientUser.getUsername(),
                                        employee.getFullName()
                                ));
                    }
                });

        // Auto-generate invoice for the active assignment
        assignmentRepo.findByEmployeeId(employeeId).stream()
                .filter(a -> a.getStatus() == AssignmentStatus.ACTIVE)
                .findFirst()
                .ifPresent(assignment -> generateInvoiceForRecord(saved, assignment, financeUser));

        return mapRecordToDto(saved);
    }

    @Transactional
    public void rejectPayroll(Long employeeId, String reason, String financeUserEmail) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        User financeUser = userRepo.findByEmail(financeUserEmail).orElse(null);

        employee.setStatus(EmployeeStatus.INFRASTRUCTURE_ASSIGNED);
        employeeRepo.save(employee);

        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("PAYROLL_REJECTED");
        event.setDescription("Finance rejected payroll: " + reason);
        event.setPerformedBy(financeUser);
        eventRepo.save(event);
    }

    public List<PayrollRecordDto> getPayrollHistory(Long employeeId) {
        return payrollRepo.findByEmployeeIdOrderByPeriodMonthDesc(employeeId)
                .stream().map(this::mapRecordToDto).collect(Collectors.toList());
    }

    public List<InvoiceDto> getInvoicesByAssignment(Long assignmentId) {
        return invoiceRepo.findByAssignmentIdOrderByPeriodMonthDesc(assignmentId)
                .stream().map(this::mapInvoiceToDto).collect(Collectors.toList());
    }

    public List<InvoiceDto> getInvoicesByEmployee(Long employeeId) {
        return assignmentRepo.findByEmployeeId(employeeId).stream()
                .flatMap(a -> invoiceRepo.findByAssignmentIdOrderByPeriodMonthDesc(a.getId()).stream())
                .map(this::mapInvoiceToDto)
                .collect(Collectors.toList());
    }

    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepo.findAll().stream().map(this::mapInvoiceToDto).collect(Collectors.toList());
    }

    // ─── Private helpers ───────────────────────────────────────────────────────

    private EmployeeContract getActiveContract(Long employeeId) {
        return contractRepo.findFirstByEmployeeIdAndStatusOrderByCreatedAtDesc(employeeId, ContractStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active contract for employee: " + employeeId));
    }

    private BigDecimal sumInfraCost(Long employeeId, LocalDate month) {
        return infraRepo.findByEmployeeId(employeeId).stream()
                .map(InfrastructureCost::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private PayrollRecordDto buildPayrollDto(Long employeeId, EmployeeContract contract,
                                              BigDecimal infraTotal, LocalDate month) {
        BigDecimal gross = contract.getGrossSalary();
        BigDecimal bonus = contract.getBonus() != null ? contract.getBonus() : BigDecimal.ZERO;

        // Employee deductions
        BigDecimal empCnss = gross.multiply(EMPLOYEE_CNSS).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal irpp = gross.subtract(empCnss).multiply(FLAT_IRPP_RATE).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal net = gross.subtract(empCnss).subtract(irpp).add(bonus).setScale(SCALE, RoundingMode.HALF_UP);

        // Employer cost
        BigDecimal emplrCnss = gross.multiply(EMPLOYER_CNSS).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal subTotal = gross.add(emplrCnss).add(infraTotal);

        BigDecimal recruitMarginPct = resolveMargin(employeeId, "RECRUITMENT");
        BigDecimal infraMarginPct = resolveMargin(employeeId, "INFRASTRUCTURE");
        BigDecimal recruitMargin = subTotal.multiply(recruitMarginPct, MC).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal infraMargin = infraTotal.multiply(infraMarginPct, MC).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal totalTnd = subTotal.add(recruitMargin).add(infraMargin).setScale(SCALE, RoundingMode.HALF_UP);

        BigDecimal rate = resolveExchangeRate();
        BigDecimal finalCad = totalTnd.multiply(rate).setScale(SCALE, RoundingMode.HALF_UP);

        PayrollRecordDto dto = new PayrollRecordDto();
        dto.setEmployeeId(employeeId);
        dto.setContractId(contract.getId());
        dto.setPeriodMonth(month);
        dto.setGrossSalary(gross);
        dto.setEmployeeCnss(empCnss);
        dto.setIrppTax(irpp);
        dto.setBonus(bonus);
        dto.setNetSalary(net);
        dto.setEmployerCnss(emplrCnss);
        dto.setInfraCostTotal(infraTotal);
        dto.setRecruitmentMargin(recruitMargin);
        dto.setInfraMargin(infraMargin);
        dto.setTotalEmployerCostTnd(totalTnd);
        dto.setFinalInvoiceCad(finalCad);
        dto.setExchangeRateUsed(rate);
        
        dto.setMonthlyBudgetTnd(totalTnd);
        dto.setAnnualBudgetTnd(totalTnd.multiply(new BigDecimal("12")));
        
        java.util.List<tn.stage.backend.DTO.YearProjectionDto> projections = new java.util.ArrayList<>();
        BigDecimal year1Tnd = dto.getAnnualBudgetTnd();
        BigDecimal year1Cad = finalCad.multiply(new BigDecimal("12"));
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(1, year1Tnd, year1Cad));
        
        BigDecimal raise = new BigDecimal("1.05"); // 5% annual raise assumption
        BigDecimal year2Tnd = year1Tnd.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal year2Cad = year1Cad.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(2, year2Tnd, year2Cad));
        
        BigDecimal year3Tnd = year2Tnd.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal year3Cad = year2Cad.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(3, year3Tnd, year3Cad));
        
        dto.setYearProjections(projections);

        return dto;
    }

    private BigDecimal resolveMargin(Long employeeId, String type) {
        return marginConfigRepo.findAll().stream()
                .filter(m -> m.getEffectiveTo() == null || m.getEffectiveTo().isAfter(LocalDate.now()))
                .map(MarginConfig::getMarginPercent)
                .findFirst()
                .map(p -> p.divide(new BigDecimal("100"), MC))
                .orElse(DEFAULT_RECRUITMENT_MARGIN);
    }

    private BigDecimal resolveExchangeRate() {
        return exchangeRateRepo
                .findFirstByFromCurrencyAndToCurrencyAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                        "TND", "CAD", LocalDate.now())
                .map(ExchangeRate::getRate)
                .orElse(DEFAULT_EXCHANGE_RATE);
    }

    private void generateInvoiceForRecord(PayrollRecord record, Assignment assignment, User generatedBy) {
        String invoiceNum = String.format("INV-%s-%d",
                record.getPeriodMonth().format(DateTimeFormatter.ofPattern("yyyyMM")),
                record.getEmployee().getId());

        if (invoiceRepo.findByInvoiceNumber(invoiceNum).isPresent()) return;

        Invoice invoice = new Invoice();
        invoice.setAssignment(assignment);
        invoice.setInvoiceNumber(invoiceNum);
        invoice.setPeriodMonth(record.getPeriodMonth());
        invoice.setGrossAmountTnd(record.getTotalEmployerCostTnd());
        invoice.setNetAmountCad(record.getFinalInvoiceCad());
        invoice.setExchangeRateUsed(record.getExchangeRateUsed());
        invoice.setStatus(InvoiceStatus.DRAFT);
        invoice.setGeneratedBy(generatedBy);
        invoiceRepo.save(invoice);
        
        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(assignment.getEmployee());
        event.setEventType("INVOICE_GENERATED");
        event.setDescription("Auto-generated invoice " + invoiceNum);
        event.setPerformedBy(generatedBy);
        eventRepo.save(event);
    }

    private PayrollRecordDto mapRecordToDto(PayrollRecord r) {
        PayrollRecordDto dto = new PayrollRecordDto();
        dto.setId(r.getId());
        dto.setEmployeeId(r.getEmployee().getId());
        dto.setEmployeeName(r.getEmployee().getFullName());
        dto.setContractId(r.getContract().getId());
        dto.setPeriodMonth(r.getPeriodMonth());
        dto.setGrossSalary(r.getGrossSalary());
        dto.setEmployeeCnss(r.getEmployeeCnss());
        dto.setIrppTax(r.getIrppTax());
        dto.setBonus(r.getBonus());
        dto.setNetSalary(r.getNetSalary());
        dto.setEmployerCnss(r.getEmployerCnss());
        dto.setInfraCostTotal(r.getInfraCostTotal());
        dto.setRecruitmentMargin(r.getRecruitmentMargin());
        dto.setInfraMargin(r.getInfraMargin());
        dto.setTotalEmployerCostTnd(r.getTotalEmployerCostTnd());
        dto.setFinalInvoiceCad(r.getFinalInvoiceCad());
        dto.setExchangeRateUsed(r.getExchangeRateUsed());
        dto.setStatus(r.getStatus());
        if (r.getValidatedBy() != null) dto.setValidatedByName(r.getValidatedBy().getUsername());
        dto.setValidatedAt(r.getValidatedAt());
        dto.setCreatedAt(r.getCreatedAt());

        dto.setMonthlyBudgetTnd(r.getTotalEmployerCostTnd());
        dto.setAnnualBudgetTnd(r.getTotalEmployerCostTnd().multiply(new BigDecimal("12")));
        
        java.util.List<tn.stage.backend.DTO.YearProjectionDto> projections = new java.util.ArrayList<>();
        BigDecimal year1Tnd = dto.getAnnualBudgetTnd();
        BigDecimal year1Cad = r.getFinalInvoiceCad().multiply(new BigDecimal("12"));
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(1, year1Tnd, year1Cad));
        
        BigDecimal raise = new BigDecimal("1.05"); // 5% raise
        BigDecimal year2Tnd = year1Tnd.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal year2Cad = year1Cad.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(2, year2Tnd, year2Cad));
        
        BigDecimal year3Tnd = year2Tnd.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal year3Cad = year2Cad.multiply(raise).setScale(SCALE, RoundingMode.HALF_UP);
        projections.add(new tn.stage.backend.DTO.YearProjectionDto(3, year3Tnd, year3Cad));
        
        dto.setYearProjections(projections);

        return dto;
    }

    private InvoiceDto mapInvoiceToDto(Invoice i) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(i.getId());
        dto.setAssignmentId(i.getAssignment().getId());
        if (i.getAssignment().getEmployee() != null)
            dto.setEmployeeName(i.getAssignment().getEmployee().getFullName());
        if (i.getAssignment().getClientCompany() != null)
            dto.setClientCompanyName(i.getAssignment().getClientCompany().getName());
        dto.setInvoiceNumber(i.getInvoiceNumber());
        dto.setPeriodMonth(i.getPeriodMonth());
        dto.setGrossAmountTnd(i.getGrossAmountTnd());
        dto.setNetAmountCad(i.getNetAmountCad());
        dto.setExchangeRateUsed(i.getExchangeRateUsed());
        dto.setStatus(i.getStatus());
        if (i.getGeneratedBy() != null) dto.setGeneratedByName(i.getGeneratedBy().getUsername());
        dto.setGeneratedAt(i.getGeneratedAt());
        return dto;
    }
}
