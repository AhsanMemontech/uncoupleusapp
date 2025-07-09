import { NextRequest, NextResponse } from 'next/server'
import { generateAllDocuments, processDocument } from '@/lib/documentProcessor'
import JSZip from 'jszip'

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json()
    
    if (!formData) {
      return NextResponse.json(
        { error: 'Form data is required' },
        { status: 400 }
      )
    }

    // Generate all documents
    const documents = await generateAllDocuments(formData)
    
    // Create a ZIP file containing all PDFs
    const zip = new JSZip()
    
    documents.forEach(doc => {
      if (doc.pdfBuffer) {
        zip.file(`${doc.fileName.replace('.docx', '.pdf')}`, doc.pdfBuffer)
      }
    })
    
    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    
    // Return the ZIP file as a downloadable response
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="divorce_forms.zip"',
        'Content-Length': zipBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Error generating documents:', error)
    return NextResponse.json(
      { error: 'Failed to generate documents' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('formId')
    const formData = searchParams.get('formData')
    
    if (!formId || !formData) {
      return NextResponse.json(
        { error: 'Form ID and form data are required' },
        { status: 400 }
      )
    }

    const parsedFormData = JSON.parse(formData)
    
    // Generate single document
    const document = await processDocument(formId, parsedFormData)
    
    if (!document.pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
      )
    }
    
    // Return the PDF as a downloadable response
    return new NextResponse(document.pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formId}_processed.pdf"`,
        'Content-Length': document.pdfBuffer.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Error generating single document:', error)
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
} 