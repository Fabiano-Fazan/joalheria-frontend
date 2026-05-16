import imageCompression from 'browser-image-compression';

const MAX_IMAGE_SIZE_MB = 0.5;
const MAX_IMAGE_WIDTH_OR_HEIGHT = 1600;
const IMAGE_QUALITY = 0.8;

function canUseWebP() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

function replaceExtension(fileName: string, extension: string) {
  const cleanName = fileName.replace(/\.[^.]+$/, '');
  return `${cleanName || 'imagem-comprimida'}.${extension}`;
}

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione um arquivo de imagem válido.');
  }

  const shouldUseWebP = canUseWebP();

  try {
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: MAX_IMAGE_SIZE_MB,
      maxWidthOrHeight: MAX_IMAGE_WIDTH_OR_HEIGHT,
      useWebWorker: true,
      fileType: shouldUseWebP ? 'image/webp' : file.type,
      initialQuality: IMAGE_QUALITY,
    });

    const outputType = shouldUseWebP ? 'image/webp' : compressedBlob.type || file.type;
    const outputName = shouldUseWebP ? replaceExtension(file.name, 'webp') : file.name;

    return new File([compressedBlob], outputName, {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error(error);
    throw new Error('Não foi possível comprimir essa imagem. Tente outra foto ou um formato diferente.');
  }
}
