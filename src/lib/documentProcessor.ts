import { Document, Packer, Paragraph, TextRun } from 'docx'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { replacePlaceholders } from './fieldMapping'

export interface ProcessedDocument {
  fileName: string
  content: string
  pdfBuffer?: Buffer
}

export async function processDocument(
  formId: string,
  formData: any
): Promise<ProcessedDocument> {
  try {
    // Create document content from templates
    const processedContent = await processDocxContent(formData, formId)
    
    // Generate PDF from the processed content
    const pdfBuffer = await generatePDF(processedContent, formId)
    
    return {
      fileName: `${formId}_processed.docx`,
      content: processedContent,
      pdfBuffer
    }
  } catch (error) {
    console.error('Error processing document:', error)
    throw error
  }
}

async function processDocxContent(
  formData: any,
  formId: string
): Promise<string> {
  try {
    // Create document templates for each form type
    const templates = {
      'UD-1': {
        title: 'SUMMONS WITH NOTICE',
        content: `TO: {Defendant_Name}\n\nYou are hereby summoned to answer the complaint in this action and to serve a copy of your answer, or, if the complaint is not served with this summons, to serve a notice of appearance, on the plaintiff's attorney within 20 days after the service of this summons.\n\nDATED: {Marriage_Breakdown_Date}\n\nPlaintiff: {Plaintiff_Name}\nPlaintiff's Address: {Plaintiff_Address}`
      },
      'UD-2': {
        title: 'VERIFIED COMPLAINT FOR DIVORCE',
        content: `Plaintiff: {Plaintiff_Name}\nDefendant: {Defendant_Name}\n\n1. Plaintiff resides at {Plaintiff_Address}.\n2. Defendant resides at {Defendant_Address}.\n3. The parties were married on {Marriage_Date} in {Marriage_City}, {Marriage_State}.\n4. The marriage has broken down irretrievably for a period of at least six months.\n5. The grounds for divorce are irretrievable breakdown of the marriage.\n6. Plaintiff requests that the marriage be dissolved.`
      },
      'UD-6': {
        title: 'AFFIDAVIT OF SERVICE',
        content: `I, {Plaintiff_Name}, being duly sworn, depose and say:\n\n1. I am the plaintiff in this action.\n2. On {Service_Date}, I served the Summons with Notice and Verified Complaint for Divorce upon {Defendant_Name}.\n3. Service was made by [method of service].\n4. The defendant was served at [address where served].`
      },
      'UD-11': {
        title: 'JUDGMENT OF DIVORCE',
        content: `IT IS ORDERED AND ADJUDGED that:\n\n1. The marriage between {Plaintiff_Name} and {Defendant_Name} is hereby dissolved.\n\n2. The parties were married on {Marriage_Date} in {Marriage_City}, {Marriage_State}.\n\n3. The grounds for divorce are irretrievable breakdown of the marriage.\n\n4. All other relief requested is granted as set forth in the Settlement Agreement.\n\n5. This judgment is effective immediately.`
      },
      'UD-10': {
        title: 'SETTLEMENT AGREEMENT',
        content: `This agreement is made between {Plaintiff_Name} ("Plaintiff") and {Defendant_Name} ("Defendant") on {Marriage_Breakdown_Date}.\n\n1. PROPERTY DIVISION:\n   - Shared Bank Accounts: {Shared_Bank_Accounts}\n   - Bank Account Details: {Bank_Account_Details}\n   - Shared Property/Vehicles: {Shared_Property_Vehicles}\n   - Property/Vehicle Details: {Property_Vehicle_Details}\n\n2. SPOUSAL SUPPORT:\n   - Include Spousal Support: {Include_Spousal_Support}\n   - Amount: {Spousal_Support_Amount}\n   - Duration: {Spousal_Support_Duration}\n\n3. NAME CHANGES:\n   - Plaintiff wants to revert name: {Want_To_Revert_Name}\n   - Plaintiff's former name: {Your_Former_Name}\n   - Defendant wants to revert name: {Spouse_Want_To_Revert}\n   - Defendant's former name: {Spouse_Former_Name}`
      },
      'UD-9': {
        title: 'FINANCIAL DISCLOSURE AFFIDAVIT',
        content: `I, {Plaintiff_Name}, being duly sworn, depose and say:\n\n1. My name is {Plaintiff_Name}.\n2. I reside at {Plaintiff_Address}.\n3. My contact information is {Plaintiff_Email}, {Plaintiff_Phone}.\n4. I was married to {Defendant_Name} on {Marriage_Date} in {Marriage_City}, {Marriage_State}.\n\nFINANCIAL INFORMATION:\n- Shared Bank Accounts: {Shared_Bank_Accounts}\n- Bank Account Details: {Bank_Account_Details}\n- Shared Property/Vehicles: {Shared_Property_Vehicles}\n- Property/Vehicle Details: {Property_Vehicle_Details}\n- Spousal Support: {Include_Spousal_Support}\n- Support Amount: {Spousal_Support_Amount}\n- Support Duration: {Spousal_Support_Duration}\n\nI declare under penalty of perjury that the foregoing is true and correct.`
      }
    }
    
    const template = templates[formId as keyof typeof templates]
    if (!template) {
      throw new Error(`Template not found for form ${formId}`)
    }
    
    // Replace placeholders in the content
    let processedContent = replacePlaceholders(template.content, formData, formId)
    
    // Add title
    processedContent = `${template.title}\n\n${processedContent}`
    
    return processedContent
  } catch (error) {
    console.error('Error processing DOCX content:', error)
    throw error
  }
}

async function generatePDF(content: string, formId: string): Promise<Buffer> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage([612, 792]) // Standard letter size
    
    // Embed the standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    // Set up text properties
    const fontSize = 12
    const lineHeight = fontSize * 1.2
    let yPosition = page.getHeight() - 50 // Start from top with margin
    
    // Split content into lines
    const lines = content.split('\n')
    
    for (const line of lines) {
      // Check if line is a title (all caps or contains specific keywords)
      const isTitle = line.toUpperCase() === line && line.length > 3 || 
                     line.includes('SUMMONS') || 
                     line.includes('COMPLAINT') || 
                     line.includes('AFFIDAVIT') || 
                     line.includes('JUDGMENT') || 
                     line.includes('AGREEMENT') ||
                     line.includes('DISCLOSURE')
      
      const currentFont = isTitle ? boldFont : font
      const currentFontSize = isTitle ? fontSize + 2 : fontSize
      
      // Check if we need a new page
      if (yPosition < 50) {
        page = pdfDoc.addPage([612, 792])
        yPosition = page.getHeight() - 50
      }
      
      // Draw the text
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: currentFontSize,
        font: currentFont,
        color: rgb(0, 0, 0)
      })
      
      yPosition -= lineHeight
    }
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export async function generateAllDocuments(formData: any): Promise<ProcessedDocument[]> {
  const formIds = ['UD-1', 'UD-2', 'UD-6', 'UD-11', 'UD-10', 'UD-9']
  const documents: ProcessedDocument[] = []
  
  for (const formId of formIds) {
    try {
      const document = await processDocument(formId, formData)
      documents.push(document)
    } catch (error) {
      console.error(`Error processing ${formId}:`, error)
      // Continue with other documents even if one fails
    }
  }
  
  return documents
} 