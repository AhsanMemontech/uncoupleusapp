import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { fieldMappings, getFieldValue } from './fieldMapping'

export interface ProcessedDocument {
  fileName: string
  content: string
  docxBuffer?: Buffer
}

export async function processDocxFile(
  formId: string,
  formData: any
): Promise<ProcessedDocument> {
  try {
    // Map form IDs to actual file names
    const fileMap: { [key: string]: string } = {
      'UD-1': 'UD-1 - Summons Template.docx',
      'UD-2': 'UD-2 - Verified Complaint.docx',
      'UD-6': 'UD-6 - Affidavit of Service.docx',
      'UD-9': 'UD-9 - Financial Disclosure Affidavit.docx',
      'UD-10': 'UD-10 - Settlement Agreement.docx',
      'UD-11': 'UD-11 - Judgment of Divorce.docx'
    }

    const fileName = fileMap[formId]
    if (!fileName) {
      throw new Error(`No template file found for form ${formId}`)
    }

    console.log(`Processing ${formId}: ${fileName}`)

    // Fetch the .docx file from the public directory
    const response = await fetch(`/courtforms/${fileName}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch template file: ${fileName} (${response.status})`)
    }

    const arrayBuffer = await response.arrayBuffer()
    console.log(`Fetched ${fileName}, size: ${arrayBuffer.byteLength} bytes`)
    
    // Load the document
    const zip = new PizZip(arrayBuffer)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '<<',
        end: '>>'
      }
    })

    // Prepare the data for template replacement
    const templateData = prepareTemplateData(formData, formId)
    console.log(`Template data for ${formId}:`, templateData)
    
    // Render the document
    doc.render(templateData)
    
    // Generate the filled document
    const output = doc.getZip().generate({ type: 'nodebuffer' })
    console.log(`Generated ${formId}, output size: ${output.length} bytes`)
    
    return {
      fileName: `${formId}_filled.docx`,
      content: 'Document filled successfully',
      docxBuffer: Buffer.from(output)
    }
  } catch (error) {
    console.error('Error processing DOCX file:', error)
    throw error
  }
}

function prepareTemplateData(formData: any, formId: string): any {
  const mapping = fieldMappings[formId] || {}
  const templateData: any = {}
  
  // Convert the mapping to the format expected by docxtemplater
  for (const [placeholder, fieldName] of Object.entries(mapping)) {
    // Remove the <<>> delimiters for docxtemplater
    const cleanPlaceholder = placeholder.replace(/[<>]/g, '')
    templateData[cleanPlaceholder] = getFieldValue(fieldName, formData)
  }
  
  return templateData
}

export async function generateAllDocxFiles(formData: any): Promise<ProcessedDocument[]> {
  const formIds = ['UD-1', 'UD-2', 'UD-6', 'UD-9', 'UD-10', 'UD-11']
  const documents: ProcessedDocument[] = []
  
  for (const formId of formIds) {
    try {
      const document = await processDocxFile(formId, formData)
      documents.push(document)
    } catch (error) {
      console.error(`Error processing ${formId}:`, error)
      // Continue with other documents even if one fails
    }
  }
  
  return documents
}

// Helper function to create a ZIP file from multiple documents
export async function createDocumentsZip(documents: ProcessedDocument[]): Promise<Blob> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  
  console.log(`Creating ZIP with ${documents.length} documents`)
  
  documents.forEach(doc => {
    if (doc.docxBuffer) {
      console.log(`Adding ${doc.fileName} to ZIP (${doc.docxBuffer.length} bytes)`)
      zip.file(doc.fileName, doc.docxBuffer)
    } else {
      console.warn(`Document ${doc.fileName} has no buffer`)
    }
  })
  
  const blob = await zip.generateAsync({ type: 'blob' })
  console.log(`Generated ZIP blob: ${blob.size} bytes`)
  return blob
} 