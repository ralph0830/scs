'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { UploadCloud, X } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  onChange: (src: string) => void
  disabled?: boolean
}

export const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    // 1. Validate on client
    const isValid = await validateImage(file)
    if (!isValid) {
      setIsUploading(false)
      return
    }

    // 2. Upload
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      // 3. Call onChange with new URL
      onChange(result.url)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image.')
    } finally {
      setIsUploading(false)
    }
  }

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.')
        resolve(false)
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const image = document.createElement('img')
        image.src = e.target?.result as string
        image.onload = () => {
          const { height, width } = image
          if (height > 100 || width > 100) {
            toast.error('Image dimensions must be 100x100 pixels or smaller.')
            resolve(false)
          } else {
            resolve(true)
          }
        }
        image.onerror = () => {
            toast.error('Could not load image to validate dimensions.')
            resolve(false)
        }
      }
    })
  }

  return (
    <div>
      {value ? (
        <div className="relative h-24 w-24">
          <Image 
            fill 
            src={value} 
            alt="Uploaded image" 
            sizes="96px"
            className="rounded-md object-cover" 
          />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:bg-rose-600"
            type="button"
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 100x100px)</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              disabled={disabled || isUploading}
            />
          </label>
           {isUploading && <p className="text-sm mt-2 animate-pulse">Uploading...</p>}
        </div>
      )}
    </div>
  )
} 