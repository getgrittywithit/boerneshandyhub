import { NextRequest, NextResponse } from 'next/server'

interface ClaimRequest {
  businessId: string
  claimerEmail: string
  claimerName: string
  claimerPhone: string
  businessRole: 'owner' | 'manager' | 'employee'
  verificationDocs: string[] // URLs to uploaded documents
  additionalInfo?: string
}

interface BusinessClaim {
  id: string
  businessId: string
  claimerEmail: string
  claimerName: string
  claimerPhone: string
  businessRole: 'owner' | 'manager' | 'employee'
  verificationDocs: string[]
  additionalInfo?: string
  status: 'pending' | 'under_review' | 'verified' | 'rejected'
  submittedAt: string
  adminNotes?: string
  verificationSteps: {
    emailSent: boolean
    phoneCalled: boolean
    mailSent: boolean
    documentsReviewed: boolean
  }
}

// In a real app, this would be a database
const businessClaims: BusinessClaim[] = []

export async function POST(request: NextRequest) {
  try {
    const body: ClaimRequest = await request.json()

    // Validate required fields
    if (!body.businessId || !body.claimerEmail || !body.claimerName || !body.claimerPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if business is already claimed or has pending claim
    const existingClaim = businessClaims.find(
      claim => claim.businessId === body.businessId && 
      (claim.status === 'verified' || claim.status === 'pending' || claim.status === 'under_review')
    )

    if (existingClaim) {
      return NextResponse.json(
        { 
          success: false, 
          error: existingClaim.status === 'verified' 
            ? 'Business is already claimed and verified' 
            : 'Business has a pending claim request' 
        },
        { status: 409 }
      )
    }

    // Create new claim
    const newClaim: BusinessClaim = {
      id: `claim_${Date.now()}`,
      businessId: body.businessId,
      claimerEmail: body.claimerEmail,
      claimerName: body.claimerName,
      claimerPhone: body.claimerPhone,
      businessRole: body.businessRole,
      verificationDocs: body.verificationDocs || [],
      additionalInfo: body.additionalInfo,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      verificationSteps: {
        emailSent: false,
        phoneCalled: false,
        mailSent: false,
        documentsReviewed: false
      }
    }

    businessClaims.push(newClaim)

    // TODO: Send confirmation email to claimer
    // TODO: Send notification to admin
    // TODO: Start verification process

    return NextResponse.json({
      success: true,
      claim: {
        id: newClaim.id,
        status: newClaim.status,
        submittedAt: newClaim.submittedAt
      }
    })

  } catch (error) {
    console.error('Error processing business claim:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (businessId) {
      const claims = businessClaims.filter(claim => claim.businessId === businessId)
      return NextResponse.json({ success: true, claims })
    }

    // Return all claims (admin use)
    return NextResponse.json({ success: true, claims: businessClaims })

  } catch (error) {
    console.error('Error retrieving claims:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve claims' },
      { status: 500 }
    )
  }
}