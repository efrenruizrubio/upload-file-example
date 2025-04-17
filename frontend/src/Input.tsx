import { useEffect, useRef, useState } from 'react'

export default function Input() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [newFile, setNewFile] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const getFileById = async () => {
      try {
        const response = await fetch('http://localhost:3000/upload/2')

        if (response.ok) {
          const contentDisposition = response.headers.get('content-disposition')
          const filename =
            contentDisposition?.split('filename=').at(-1) ?? 'file'
          const blob = await response.blob()
          const newFile = new File([blob], filename, { type: blob.type })
          setFile(newFile)
        }
      } catch (e) {
        console.error(e)
      }
    }

    getFileById()
  }, [])

  useEffect(() => {
    if (file && !url) {
      const newUrl = URL.createObjectURL(file)

      setUrl(newUrl)
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
        setUrl(null)
      }
    }
  }, [file, url])
  return (
    <form
      onSubmit={async () => {
        try {
          const formData = new FormData()
          formData.append('file', file as Blob)
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            throw new Error('Error uploading file')
          }

          alert(JSON.stringify(response.body))
        } catch (e) {
          console.error(e)
        }
      }}
      className='input_container'
    >
      <label htmlFor='file'>File 1</label>
      <input
        type='file'
        id='file'
        multiple={false}
        accept='application/pdf,image/png,image/jpeg,image/jpg'
        ref={inputRef}
        onChange={(e) => {
          setFile(e.target.files?.item(0) ?? null)
          setNewFile(true)
        }}
        hidden
      />
      <button
        type='button'
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        Upload file
      </button>
      {!file || !url ? (
        <span>No file uploaded</span>
      ) : (
        <a href={url} target='_blank'>
          {file.name}
        </a>
      )}
      <button disabled={!file || !url || !newFile}>Submit</button>
    </form>
  )
}
