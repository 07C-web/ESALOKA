import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

// ── Hanya bisa dipanggil oleh admin yang sudah login ──────────
export async function POST(req: NextRequest) {
  try {
    const { application_id, action, rejection_note } = await req.json()

    if (!application_id || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // 1. Verifikasi caller adalah admin
    const supabaseServer = await createServerClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: callerProfile } = await supabaseServer
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (callerProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Ambil data aplikasi
    const { data: app, error: appError } = await supabaseServer
      .from('partner_applications')
      .select('*')
      .eq('id', application_id)
      .single()

    if (appError || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // 3. Pastikan status masih bisa di-action (tidak boleh mundur)
    const allowedStatuses = ['pending', 'reviewed']
    if (!allowedStatuses.includes(app.status)) {
      return NextResponse.json(
        { error: 'Aplikasi sudah final — tidak bisa diubah lagi' },
        { status: 409 }
      )
    }

    const now = new Date().toISOString()

    // ── REJECT ────────────────────────────────────────────────
    if (action === 'reject') {
      await supabaseServer
        .from('partner_applications')
        .update({
          status:         'rejected',
          reviewed_by:    user.id,
          reviewed_at:    now,
          rejection_note: rejection_note || null,
        })
        .eq('id', application_id)

      return NextResponse.json({ success: true, action: 'rejected' })
    }

    // ── APPROVE ───────────────────────────────────────────────
    if (action === 'approve') {
      if (!app.pic_email) {
        return NextResponse.json(
          { error: 'Email mitra tidak ada. Minta calon mitra untuk mendaftar ulang dengan email.' },
          { status: 422 }
        )
      }

      // 4. Buat Supabase Auth user dengan service_role key
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      // Generate temp password: nama bisnis + 4 digit random
      const tempPassword = app.business_name
        .replace(/\s+/g, '')
        .toLowerCase()
        .slice(0, 6) + Math.floor(1000 + Math.random() * 9000)

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email:             app.pic_email,
        password:          tempPassword,
        email_confirm:     true,   // langsung confirmed, tidak perlu verifikasi email
        user_metadata: {
          full_name: app.pic_name,
          role:      'mitra',
        },
      })

      if (createError || !newUser.user) {
        // Kalau email sudah terdaftar, tangani dengan pesan yang jelas
        if (createError?.message?.includes('already registered')) {
          return NextResponse.json(
            { error: 'Email ini sudah terdaftar sebagai user. Cek di Supabase Auth.' },
            { status: 409 }
          )
        }
        return NextResponse.json(
          { error: `Gagal membuat akun: ${createError?.message}` },
          { status: 500 }
        )
      }

      const newUserId = newUser.user.id

      // 5. Pastikan user_profiles sudah ter-insert oleh trigger
      //    Kalau trigger lambat, insert manual dengan upsert
      await supabaseAdmin
        .from('user_profiles')
        .upsert({
          id:        newUserId,
          email:     app.pic_email,
          full_name: app.pic_name,
          role:      'mitra',
        }, { onConflict: 'id' })

      // 6. Insert ke tabel mitra
      const { error: mitraError } = await supabaseAdmin
        .from('mitra')
        .insert({
          user_id:           newUserId,
          business_name:     app.business_name,
          business_type:     app.business_type,
          subscription_tier: app.desired_tier,
          pic_name:          app.pic_name,
          pic_phone:         app.pic_phone,
          is_active:         true,
          joined_at:         new Date().toISOString().split('T')[0],
        })

      if (mitraError) {
        // Rollback: hapus user yang sudah dibuat
        await supabaseAdmin.auth.admin.deleteUser(newUserId)
        return NextResponse.json(
          { error: `Gagal insert mitra: ${mitraError.message}` },
          { status: 500 }
        )
      }

      // 7. Update status aplikasi jadi approved
      await supabaseAdmin
        .from('partner_applications')
        .update({
          status:      'approved',
          reviewed_by: user.id,
          reviewed_at: now,
        })
        .eq('id', application_id)

      return NextResponse.json({
        success:       true,
        action:        'approved',
        temp_password: tempPassword,
        email:         app.pic_email,
        business_name: app.business_name,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err: any) {
    console.error('[approve-mitra]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
