import { NextRequest, NextResponse } from 'next/server'
import { processDocxFile } from '@/lib/docxProcessor'

export async function POST(request: NextRequest) {
  try {
    const { formId, formData } = await request.json()
    
    if (!formId || !formData) {
      return NextResponse.json(
        { error: 'Form ID and form data are required' },
        { status: 400 }
      )
    }

    // Process the docx file
    const processedDoc = await processDocxFile(formId, formData)
    
    if (!processedDoc.docxBuffer) {
      return NextResponse.json(
        { error: 'Failed to process document' },
        { status: 500 }
      )
    }

    try {
      // Try LibreOffice conversion if available
      const libre = await import('libreoffice-convert')
      const { promisify } = await import('util')
      const convertAsync = promisify(libre.default.convert)
      
      const pdfBuffer = await convertAsync(processedDoc.docxBuffer, '.pdf', undefined)
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${processedDoc.fileName.replace('.docx', '.pdf')}"`,
          'Content-Length': pdfBuffer.length.toString()
        }
      })
    } catch (libreError) {
      console.log('LibreOffice not available, using fallback method')
      
      // Fallback: Return the docx file with instructions
      return new NextResponse(processedDoc.docxBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${processedDoc.fileName}"`,
          'Content-Length': processedDoc.docxBuffer.length.toString()
        }
      })
    }
    
  } catch (error) {
    console.error('Error converting to PDF:', error)
    return NextResponse.json(
      { error: 'Failed to convert document' },
      { status: 500 }
    )
  }
} 