import { updateUserTheme } from '@/database/queries/user'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { user_id, theme } = await request.json();
        console.log("user_id: ", user_id);
        console.log("theme: ", theme);
        
        await updateUserTheme(user_id, theme)

        return NextResponse.json({ message: 'Theme Set Successfully' }, { status: 200 })
    } catch (error) {
        console.error('Theme update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
