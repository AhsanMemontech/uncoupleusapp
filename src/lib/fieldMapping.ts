export interface FieldMapping {
  [key: string]: string
}

// Field mapping configuration for court forms
export const fieldMappings: { [formId: string]: FieldMapping } = {
  'UD-1': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Plaintiff_Email>>': 'yourEmail',
    '<<Plaintiff_Phone>>': 'yourPhone',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Ceremony_Type>>': 'ceremonyType',
    '<<Marriage_Breakdown_Date>>': 'marriageBreakdownDate',
    '<<Filing_No_Fault>>': 'filingNoFault',
    '<<Lived_In_NY_2_Years>>': 'livedInNY2Years',
    '<<Alternative_Route>>': 'alternativeRoute'
  },
  'UD-2': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Plaintiff_Email>>': 'yourEmail',
    '<<Plaintiff_Phone>>': 'yourPhone',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Ceremony_Type>>': 'ceremonyType',
    '<<Marriage_Breakdown_Date>>': 'marriageBreakdownDate',
    '<<Filing_No_Fault>>': 'filingNoFault',
    '<<Lived_In_NY_2_Years>>': 'livedInNY2Years',
    '<<Alternative_Route>>': 'alternativeRoute',
    '<<Has_Settlement_Agreement>>': 'hasSettlementAgreement',
    '<<Shared_Bank_Accounts>>': 'sharedBankAccounts',
    '<<Bank_Account_Details>>': 'bankAccountDetails',
    '<<Shared_Property_Vehicles>>': 'sharedPropertyVehicles',
    '<<Property_Vehicle_Details>>': 'propertyVehicleDetails',
    '<<Include_Spousal_Support>>': 'includeSpousalSupport',
    '<<Spousal_Support_Amount>>': 'spousalSupportAmount',
    '<<Spousal_Support_Duration>>': 'spousalSupportDuration'
  },
  'UD-6': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Service_Date>>': 'marriageBreakdownDate' // Using breakdown date as service date for demo
  },
  'UD-11': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Ceremony_Type>>': 'ceremonyType',
    '<<Marriage_Breakdown_Date>>': 'marriageBreakdownDate',
    '<<Filing_No_Fault>>': 'filingNoFault',
    '<<Has_Settlement_Agreement>>': 'hasSettlementAgreement',
    '<<Shared_Bank_Accounts>>': 'sharedBankAccounts',
    '<<Bank_Account_Details>>': 'bankAccountDetails',
    '<<Shared_Property_Vehicles>>': 'sharedPropertyVehicles',
    '<<Property_Vehicle_Details>>': 'propertyVehicleDetails',
    '<<Include_Spousal_Support>>': 'includeSpousalSupport',
    '<<Spousal_Support_Amount>>': 'spousalSupportAmount',
    '<<Spousal_Support_Duration>>': 'spousalSupportDuration',
    '<<Want_To_Revert_Name>>': 'wantToRevertName',
    '<<Your_Former_Name>>': 'yourFormerName',
    '<<Spouse_Want_To_Revert>>': 'spouseWantToRevert',
    '<<Spouse_Former_Name>>': 'spouseFormerName'
  },
  'UD-10': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Marriage_Breakdown_Date>>': 'marriageBreakdownDate',
    '<<Has_Settlement_Agreement>>': 'hasSettlementAgreement',
    '<<Shared_Bank_Accounts>>': 'sharedBankAccounts',
    '<<Bank_Account_Details>>': 'bankAccountDetails',
    '<<Shared_Property_Vehicles>>': 'sharedPropertyVehicles',
    '<<Property_Vehicle_Details>>': 'propertyVehicleDetails',
    '<<Include_Spousal_Support>>': 'includeSpousalSupport',
    '<<Spousal_Support_Amount>>': 'spousalSupportAmount',
    '<<Spousal_Support_Duration>>': 'spousalSupportDuration'
  },
  'UD-9': {
    '<<Plaintiff_Name>>': 'yourFullName',
    '<<Defendant_Name>>': 'spouseFullName',
    '<<Plaintiff_Address>>': 'yourAddress',
    '<<Defendant_Address>>': 'spouseLastKnownAddress',
    '<<Plaintiff_Email>>': 'yourEmail',
    '<<Plaintiff_Phone>>': 'yourPhone',
    '<<Marriage_Date>>': 'marriageDate',
    '<<Marriage_City>>': 'marriageCity',
    '<<Marriage_State>>': 'marriageState',
    '<<Shared_Bank_Accounts>>': 'sharedBankAccounts',
    '<<Bank_Account_Details>>': 'bankAccountDetails',
    '<<Shared_Property_Vehicles>>': 'sharedPropertyVehicles',
    '<<Property_Vehicle_Details>>': 'propertyVehicleDetails',
    '<<Include_Spousal_Support>>': 'includeSpousalSupport',
    '<<Spousal_Support_Amount>>': 'spousalSupportAmount',
    '<<Spousal_Support_Duration>>': 'spousalSupportDuration'
  }
}

// Helper function to get field value with proper formatting
export function getFieldValue(fieldName: string, formData: any): string {
  const value = formData[fieldName]
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  if (typeof value === 'string') {
    // Handle date formatting
    if (fieldName.includes('Date') && value) {
      try {
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return value
      }
    }
    
    // Handle ceremony type formatting
    if (fieldName === 'ceremonyType') {
      return value === 'Civil' ? 'Civil Ceremony' : 'Religious Ceremony'
    }
    
    // Handle alternative route formatting
    if (fieldName === 'alternativeRoute') {
      const routes = {
        'marriage_in_ny': 'Marriage took place in NY',
        'grounds_occurred_ny': 'Grounds for divorce occurred in NY',
        'both_parties_consent': 'Both parties consent to NY jurisdiction'
      }
      return routes[value as keyof typeof routes] || value
    }
    
    return value
  }
  
  return String(value || '')
}

// Helper function to replace all placeholders in text
export function replacePlaceholders(text: string, formData: any, formId: string): string {
  const mapping = fieldMappings[formId] || {}
  
  let result = text
  
  for (const [placeholder, fieldName] of Object.entries(mapping)) {
    const value = getFieldValue(fieldName, formData)
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
  }
  
  return result
} 