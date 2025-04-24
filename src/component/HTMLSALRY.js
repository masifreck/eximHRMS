import { ElBase64 } from './EximBase64Logo';

export const SalaryHTML = (salaryDetail,netPayinWords) => {
  // console.log('data in html', salaryDetail);
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip - December 2024</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    h2, h3 {
      text-align: center;
      margin-block-end: 0em;
      margin-block-start: 0em;
    }
    .section {
      margin-top: 0px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    p {
      margin-block-end: 0em;
      margin-block-start: 0em;
    }
    th, td {
      border: 1px solid #aaa;
      padding: 1px;
      text-align: left;
      margin-block-end: 2em;
      margin-block-start: 2em;
    }
    th {
      background-color: #ffe9ec;
    }
    .two-column {
      display: flex;
      justify-content: space-between;
    }
    .two-column div {
      width: 48%;
    }
    .highlight {
      background-color: #e0f7fa;
      font-weight: bold;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .info-row span:first-child {
      text-align: left;
    
      font-weight: bold;
    }
    .info-row span:last-child {
      text-align: left;
      
    }
       .info-bank {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .info-bank span:first-child {
      text-align: left;
    
      font-weight: bold;
    }
    .info-bank span:last-child {
      text-align: left;
      width:'70%'
    }
  </style>
</head>
<body>
<div style="display:flex; justify-content: space-between; align-items: center;">
 <img src="${ElBase64}" alt="Company Logo" width="90" height="90">
  <h2>PAYSLIP MONTH : ${salaryDetail.MonthName} - ${salaryDetail.P_Year}</h2>
 
</div>

  <div class="section">
    <h3 style="margin-bottom:10px;">Personal Information</h3>
    <div class="two-column">
      <div>
        <p class="info-row"><span>Name:</span><span>${salaryDetail.FirstName}</span></p>
        <p class="info-row"><span>Employee Code:</span>${salaryDetail.EmployeeCode}</span></p>
        <p class="info-row"><span>Department:</span><span>${salaryDetail.Department}</span></p>
        <p class="info-row"><span>Designation:</span><span>${salaryDetail.Designation}</span></p>
        <p class="info-row"><span>Grade:</span><span>${salaryDetail.Grade}</span></p>
      </div>
      <div>
        <p class="info-row"><span>Branch:</span><span>${salaryDetail.BranchName}</span></p>
        <p class="info-row"><span>PAN:</span><span>${salaryDetail.PanNo}</span></p>
        <p class="info-row"><span>EPFO UAN:</span><span>${salaryDetail.UAN}</span></p>
        <p class="info-row"><span>DOJ:</span><span>${salaryDetail.JoiningDate.split('T')[0]}</span></p>
      </div>
    </div>
  </div>

  <div style="margin-top:10px;" class="section">
    <h3>Attendance / Leave - ${salaryDetail.MonthName} - ${salaryDetail.P_Year}</h3>
    <table>
      <tr>
        <th>Paid Days</th><th>LWP</th><th>Total Present</th><th>Weekly Off</th><th>National Holiday</th><th>JLAB</th>
      </tr>
      <tr>
        <td>${salaryDetail.PaidDays}</td><td>${salaryDetail.LWP}</td><td>${salaryDetail.TotalDays?salaryDetail.TotalDays : 0}</td><td>${salaryDetail.WeeklyOff}</td><td>${salaryDetail.NH}</td><td>${salaryDetail.JLAB}</td>
      </tr>
    </table>
  </div>

  <div style="margin-top:10px;" class="section">
    <h3>Earnings & Deductions</h3>
    <table>
      <tr>
        <th>Earnings</th><th>Amount</th>
        <th>Deductions</th><th>Amount</th>
        <th>Employer Contribution</th><th>Amount</th>
      </tr>
      <tr>
        <td>Basic Salary</td><td>${salaryDetail.BasicSalary}</td>
        <td>PF</td><td>${salaryDetail.ProvidentFund}</td>
        <td>ESIC Employer</td><td>${salaryDetail.ESICEmployer}</td>
      </tr>
      <tr>
        
        <td>Special Allowance</td><td>${salaryDetail.SpecialAllow}</td>
        <td>Salary Advance</td><td>${salaryDetail.SalaryAdvance}</td>
        <td>EPF Employer</td><td>${salaryDetail.EPFEPSDifference}</td>
      </tr>
      <tr>
        
      <td>Medical Allowance</td><td>${salaryDetail.FixedMedicalAllowance}</td>
          <td>TDS</td><td>${salaryDetail.Tds}</td>
        <td>EPF Admin Charges</td><td>${salaryDetail.PFAdminCharges}</td>
      </tr>
      <tr>
        <td>House Rent Allowance</td><td>${salaryDetail.HRA}</td>
         <td>Loan</td><td>${salaryDetail.Loan}</td>
          <td>EPS Employer Share</td><td>${salaryDetail.EPSRemitted}</td>
        <td ></td>
      </tr>
      <tr>
      <td>Conveyance</td><td>${salaryDetail.Conveyance}</td>
          <td>Penality</td><td>${salaryDetail.Penalty}</td>
        <td colspan="3"></td>
      </tr>
      <tr>
       <td>Uniform Allowance</td><td>${salaryDetail.Uniform}</td>
          <td>Other Deduction</td><td>${salaryDetail.OtherDeduction}</td>
        <td colspan="3"></td>
      </tr>
       <tr>
       

        <td>Entertainment Allowance</td><td>${salaryDetail.Entertainment}</td>
          <td>Professional Tax</td><td>${salaryDetail.ProfessionalTax}</td>
        <td colspan="3"></td>
      </tr>
       <tr>
        <td>Allowance</td><td>${salaryDetail.Allowances}</td>
          <td>Food Deduction</td><td>${salaryDetail.FoodDeduction}</td>
        <td colspan="3"></td>
      </tr>
       <tr>
        <td>City Allowance</td><td>${salaryDetail.CityAllow}</td>
        <td colspan="4"></td>
      </tr>
         <tr>
        <td>Others</td><td>${salaryDetail.OtherPayment}</td>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td class="highlight">Total Earnings</td><td class="highlight">${salaryDetail.totalEarning}</td>
        <td class="highlight">Total Deductions</td><td class="highlight">${salaryDetail.totalDeduction}</td>
        <td class="highlight">Total Employer Contribution</td><td class="highlight">${salaryDetail.totalEmployer}</td>
      </tr>
    </table>
  </div>

  <div style="margin-top:10px;" class="section">
    <h3>Net Pay Details</h3>
    <p><strong>Net Pay:</strong> ₹ ${salaryDetail.NetPayable}/-</p>
      <p><strong>Net Pay in Words:</strong> ₹ ${netPayinWords}/-</p>
   
  </div>

  <div style="margin-top:10px;" class="section">
    <h3 style=" text-align: left; margin-bottom:10px;" >Bank & Loan Details</h3>
    
    <p class="info-bank"><span>Payment Mode:</span><span>${salaryDetail.PaymentMode}</span></p>
    <p class="info-bank"><span>Account No:</span><span>${salaryDetail.AccountNo}</span></p>
    <p class="info-bank"><span>IFSC Code:</span><span>${salaryDetail.IFSCCode}</span></p>
   
    <p style="margin-bottom:10px;"><strong>Loan Advance Details:</strong></p>
    <table>
      <tr><th>Total Amount</th><th>Recover</th><th>Balance</th></tr>
      <tr><td>₹${salaryDetail.LoanAmount}</td><td>₹${salaryDetail.LoanInstallment}</td><td>${salaryDetail.LoanBalance}</td></tr>
    </table>
  </div>

  <p style="text-align: right; margin-top: 40px;"><em>This is a system Generated Salary Sleep-Signature Not Required</em></p>

</body>
</html>
  `;
};
