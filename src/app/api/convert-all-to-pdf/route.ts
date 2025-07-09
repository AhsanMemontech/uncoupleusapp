import { NextRequest, NextResponse } from 'next/server'
import { generateAllDocxFiles } from '@/lib/docxProcessor'
import libre from 'libreoffice-convert'
import { promisify } from 'util'
import JSZip from 'jszip'

const convertAsync = promisify(libre.convert)

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json()
    
    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      )
    }

    // Generate all docx files
    const documents = await generateAllDocxFiles(formData)
    
    // Convert each docx to PDF
    const pdfDocuments = []
    for (const doc of documents) {
      if (doc.docxBuffer) {
        try {
          const pdfBuffer = await convertAsync(doc.docxBuffer, '.pdf', undefined)
          pdfDocuments.push({
            fileName: doc.fileName.replace('.docx', '.pdf'),
            pdfBuffer
          })
        } catch (error) {
          console.error(`Error converting ${doc.fileName} to PDF:`, error)
        }
      }
    }
    
    // Create ZIP file with all PDFs
    const zip = new JSZip()
    pdfDocuments.forEach(doc => {
      zip.file(doc.fileName, doc.pdfBuffer)
    })
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="divorce_forms.pdf.zip"',
        'Content-Length': zipBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Error converting all to PDF:', error)
    return NextResponse.json(
      { error: 'Failed to convert documents' },
      { status: 500 }
    )
  }
} 