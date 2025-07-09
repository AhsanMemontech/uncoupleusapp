import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export interface ProcessedPDF {
  fileName: string
  content: string
  pdfBuffer?: Uint8Array
}

export async function convertDocxToPDF(
  formId: string,
  formData: any,
  docxContent: string
): Promise<ProcessedPDF> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // Standard US Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    // Parse the docx content and extract structured content
    const structuredContent = parseDocxContent(docxContent)
    
    let yPosition = page.getHeight() - 50
    let currentPage = page
    
    for (const element of structuredContent) {
      // Check if we need a new page
      if (yPosition < 100) {
        currentPage = pdfDoc.addPage([612, 792])
        yPosition = page.getHeight() - 50
      }
      
      // Draw the element based on its type
      if (element.type === 'title' && element.text) {
        currentPage.drawText(element.text, {
          x: 50,
          y: yPosition,
          size: 16,
          font: boldFont,
          color: rgb(0, 0, 0)
        })
        yPosition -= 25
      } else if (element.type === 'heading' && element.text) {
        currentPage.drawText(element.text, {
          x: 50,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: rgb(0, 0, 0)
        })
        yPosition -= 20
      } else if (element.type === 'paragraph' && element.text) {
        const lines = splitTextIntoLines(element.text, font, 12, 512)
        for (const line of lines) {
          if (yPosition < 100) {
            currentPage = pdfDoc.addPage([612, 792])
            yPosition = page.getHeight() - 50
          }
          currentPage.drawText(line, {
            x: 50,
            y: yPosition,
            size: 12,
            font: font,
            color: rgb(0, 0, 0)
          })
          yPosition -= 15
        }
      } else if (element.type === 'field' && element.label && element.value) {
        currentPage.drawText(`${element.label}: ${element.value}`, {
          x: 50,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0, 0, 0)
        })
        yPosition -= 15
      }
      
      // Add some spacing
      yPosition -= 5
    }
    
    // Generate the PDF
    const pdfBytes = await pdfDoc.save()
    
    return {
      fileName: `${formId}_filled.pdf`,
      content: 'PDF generated successfully',
      pdfBuffer: pdfBytes
    }
  } catch (error) {
    console.error('Error converting to PDF:', error)
    throw error
  }
}

async function extractTextFromDocxBuffer(docxBuffer: Buffer): Promise<string> {
  try {
    // Import PizZip and Docxtemplater for parsing the docx
    const PizZip = (await import('pizzip')).default
    const Docxtemplater = (await import('docxtemplater')).default
    
    // Load the docx buffer
    const zip = new PizZip(docxBuffer)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '<<',
        end: '>>'
      }
    })
    
    // Get the document content as XML
    const xmlContent = doc.getZip().files['word/document.xml'].asText()
    
    // Extract text from XML content
    const textContent = extractTextFromXML(xmlContent)
    
    return textContent
  } catch (error) {
    console.error('Error extracting text from docx buffer:', error)
    return 'Error extracting content from document'
  }
}

function parseDocxContent(xmlContent: string): Array<{type: string, text?: string, label?: string, value?: string}> {
  const elements: Array<{type: string, text?: string, label?: string, value?: string}> = []
  
  // Split content into paragraphs
  const paragraphs = xmlContent.split(/<w:p[^>]*>/)
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue
    
    // Clean the paragraph text
    let text = paragraph
      .replace(/<w:br[^>]*>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
    
    if (!text) continue
    
    // Determine element type based on content
    if (text.match(/^(SUMMONS|VERIFIED COMPLAINT|AFFIDAVIT|FINANCIAL DISCLOSURE|SETTLEMENT AGREEMENT|JUDGMENT)/i)) {
      elements.push({ type: 'title', text })
    } else if (text.match(/^[A-Z\s]+:$/)) {
      // This looks like a field label
      const parts = text.split(':')
      if (parts.length >= 2) {
        elements.push({ 
          type: 'field', 
          label: parts[0].trim(), 
          value: parts.slice(1).join(':').trim() 
        })
      } else {
        elements.push({ type: 'heading', text })
      }
    } else if (text.length > 100) {
      // Long text is likely a paragraph
      elements.push({ type: 'paragraph', text })
    } else {
      // Short text might be a heading or field
      elements.push({ type: 'paragraph', text })
    }
  }
  
  return elements
}

function extractTextFromXML(xmlContent: string): string {
  // Remove XML tags and extract text content
  let text = xmlContent
    .replace(/<w:p[^>]*>/g, '\n') // Replace paragraph tags with newlines
    .replace(/<w:br[^>]*>/g, '\n') // Replace break tags with newlines
    .replace(/<[^>]*>/g, '') // Remove all other XML tags
    .replace(/&amp;/g, '&') // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  return text
}

function extractTextFromDocx(docxContent: string): string {
  // This is a simplified text extraction
  // In a real implementation, you'd parse the XML content of the .docx
  // For now, we'll return a formatted version of the content
  return docxContent
    .replace(/<[^>]*>/g, '') // Remove XML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

function splitTextIntoLines(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const testWidth = font.widthOfTextAtSize(testLine, fontSize)
    
    if (testWidth <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        // Word is too long, split it
        lines.push(word)
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

export async function generateAllPDFFiles(formData: any): Promise<ProcessedPDF[]> {
  const formIds = ['UD-1', 'UD-2', 'UD-6', 'UD-9', 'UD-10', 'UD-11']
  const documents: ProcessedPDF[] = []
  
  for (const formId of formIds) {
    try {
      // First get the docx content
      const { processDocxFile } = await import('./docxProcessor')
      const docxDoc = await processDocxFile(formId, formData)
      
      // Extract the actual content from the docx buffer
      const docxContent = await extractTextFromDocxBuffer(docxDoc.docxBuffer!)
      
      // Convert to PDF
      const pdfDoc = await convertDocxToPDF(formId, formData, docxContent)
      documents.push(pdfDoc)
      console.log(`✅ Successfully generated PDF for ${formId}`)
    } catch (error) {
      console.error(`❌ Error generating PDF for ${formId}:`, error)
      // Add a placeholder document
      documents.push({
        fileName: `${formId}_error.pdf`,
        content: `Error generating PDF for ${formId}: ${error}`,
        pdfBuffer: undefined
      })
    }
  }
  
  console.log(`Generated ${documents.length} PDF documents total`)
  return documents
}

// Helper function to create a ZIP file from multiple PDF documents
export async function createPDFsZip(documents: ProcessedPDF[]): Promise<Blob> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  
  const validDocuments = documents.filter(doc => doc.pdfBuffer)
  console.log(`Creating ZIP with ${validDocuments.length} valid PDF documents out of ${documents.length} total`)
  
  validDocuments.forEach(doc => {
    console.log(`Adding ${doc.fileName} to ZIP (${doc.pdfBuffer!.length} bytes)`)
    zip.file(doc.fileName, doc.pdfBuffer!)
  })
  
  const blob = await zip.generateAsync({ type: 'blob' })
  console.log(`Generated ZIP blob: ${blob.size} bytes`)
  return blob
} 