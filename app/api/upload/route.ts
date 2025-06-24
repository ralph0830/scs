import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { stat, mkdir } from 'fs/promises';

async function ensureDirExists(dirPath: string) {
  try {
    await stat(dirPath);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await mkdir(dirPath, { recursive: true });
    } else {
      throw error;
    }
  }
}


export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found.' }, { status: 400 })
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ success: false, error: 'File is not an image.' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), 'public/uploads')
  await ensureDirExists(uploadDir);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
  const path = join(uploadDir, filename)

  try {
    await writeFile(path, buffer)
    const imageUrl = `/uploads/${filename}`
    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ success: false, error: 'Failed to save file.' }, { status: 500 })
  }
} 